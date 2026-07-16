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
 

## References
- [React Leaflet — Official Documentation](https://react-leaflet.js.org/)
