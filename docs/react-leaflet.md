<!-- omit in toc -->
# [Impementation] Step by Step Using React Leafet
**Created By:** Mohammad Ali Rafli (MAR)  
**Created:** 2026-07-16 | **Last Updated:** -  
**Document Status:** On-Progress  

<!-- omit in toc -->
## Table of Contents
- [1. Instalation](#1-instalation)
- [2. Setup Awal](#2-setup-awal)
  - [2.1 Import Leaflet CSS](#21-import-leaflet-css)
  - [2.2 Dynamic Import (ssr: false)](#22-dynamic-import-ssr-false)
  - [2.3 Custom Icon (Wajib)](#23-custom-icon-wajib)
- [3. Contoh Implementasi](#3-contoh-implementasi)
  - [3.1 Single Marker — `Map.tsx`](#31-single-marker--maptsx)
  - [3.2 Banyak Marker + Clustering — `ManyPinPoint.tsx`](#32-banyak-marker--clustering--manypinpointtsx)
  - [3.3 Add Pin Point Interaktif — `AddPinPoint.tsx`](#33-add-pin-point-interaktif--addpinpointtsx)
- [References](#references)

## 1. Instalation
instalasi ini mengikuti referensi dari [dokumentasi react-leaflet](https://react-leaflet.js.org/docs/start-installation/).  

instalasi awal. react-leaflet tetap membutuhkan leaflet sebagai dasar librarynya.
```bash
npm install react@rc react-dom@rc leaflet
```

```bash
npm install react-leaflet@next
```

TypeScript support
```bash
npm install -D @types/leaflet
```

## 2. Setup Awal

### 2.1 Import Leaflet CSS

Leaflet membutuhkan CSS‑nya untuk rendering tile, marker, dan kontrol. Import di `app/layout.tsx`:

```tsx
import "leaflet/dist/leaflet.css";
```

### 2.2 Dynamic Import (ssr: false)

Leaflet mengakses `window` / `document` yang tidak tersedia saat SSR. Gunakan `dynamic` dengan `ssr: false` di komponen yang memanggil peta:

```tsx
"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  return <Map />;
}
```

### 2.3 Custom Icon (Wajib)

**Default icon Leaflet bermasalah di Next.js** — path gambar (`marker-icon.png`, `marker-shadow.png`) tidak tersedia di folder `public/`, menyebabkan 404. Solusinya:

1. Simpan file icon sendiri di `public/` (misal `public/marker-icon.png`)
2. Atur icon via `useEffect` agar hanya jalan di browser:

```tsx
useEffect(() => {
  L.Icon.Default.mergeOptions({
    iconUrl: "/marker-icon.png",
  });
}, []);
```

Atau buat custom icon dengan ukuran sendiri:

```tsx
const customIcon = L.icon({
  iconUrl: "/custom-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
```

Lalu gunakan di `<Marker icon={customIcon} />`.

## 3. Contoh Implementasi

### 3.1 Single Marker — `Map.tsx`

Komponen peta sederhana dengan satu marker di Monas, Jakarta menggunakan custom icon.

```tsx
"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

const Map = () => {
  const position: [number, number] = [-6.175392, 106.827153];

  const customIcon = L.icon({
    iconUrl: "/marker-icon-custom.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <MapContainer center={position} zoom={13} className="h-125 w-125">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={customIcon}>
        <Popup>Halo! Ini adalah koordinat Monas, Jakarta.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
```

### 3.2 Banyak Marker + Clustering — `ManyPinPoint.tsx`

Untuk **puluhan hingga ratusan marker** di satu peta, marker saling bertumpuk saat di-zoom-out dan sulit diklik. Solusinya: **MarkerCluster**.

Cara kerja:
- Marker yang berdekatan secara otomatis dikelompokkan menjadi satu cluster (lingkaran dengan angka).
- Saat di-zoom-in, cluster pecah menjadi cluster yang lebih kecil hingga marker individual.
- User bisa klik cluster untuk zoom ke area tersebut.

Implementasi menggunakan `react-leaflet-cluster`:

```tsx
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
```

Bungkus semua marker di dalam `<MarkerClusterGroup>`:

```tsx
<MarkerClusterGroup chunkedLoading>
  {locations.map((loc) => (
    <Marker key={loc.id} position={loc.coords} icon={customIcon}>
      <Popup>{loc.name}</Popup>
    </Marker>
  ))}
</MarkerClusterGroup>
```

**`chunkedLoading`** memuat marker bertahap agar peta tidak freeze saat render data besar.

Data lokasi disimpan terpisah di `data.ts`:

```tsx
export interface Location {
  id: number;
  name: string;
  coords: [number, number];
}

export const locations: Location[] = [
  { id: 1, name: "Serang", coords: [-6.1204, 106.1503] },
  // ...
];
```

Panggil komponen dengan `dynamic` + `ssr: false` di halaman:

```tsx
import dynamic from "next/dynamic";

const ManyPinPoint = dynamic(() => import("./Components/ManyPinPoint"), { ssr: false });

export default function Home() {
  return <ManyPinPoint />;
}
```

### 3.3 Add Pin Point Interaktif — `AddPinPoint.tsx`

Komponen untuk **menambah/memilih/menghapus pin** langsung dari UI.

**Fitur:**
- Klik peta → pin baru tersimpan di state dan muncul di peta + daftar.
- Klik pin (di peta atau di kartu daftar) → terpilih (ukuran icon membesar) + peta **fly-to** ke lokasi pin.
- Hapus pin dari detail atau kartu.
- **MarkerCluster** otomatis mengelompokkan pin yang berdekatan.
- Tiap kartu menampilkan thumbnail static map (± fallback jika service down).

**Komponen pembantu:**

| Komponen | Fungsi |
|----------|--------|
| `ClickHandler` | Tangkap event `click` di peta via `useMapEvents` |
| `MapFlyTo` | Gerakan peta ke koordinat target via `map.flyTo()` |
| `PinCard` | Kartu daftar pin dengan thumbnail + tombol hapus |

Panggil di halaman:

```tsx
const AddPinPoint = dynamic(() => import("./Components/AddPinPoint"), { ssr: false });

export default function Home() {
  return <AddPinPoint />;
}
```

## References
- [React Leaflet — Official Documentation](https://react-leaflet.js.org/)
- DeepSeek V4 Flash Free Via OpenCode
- Claude Sonnet 5 via OpenRouter
