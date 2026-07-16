<!-- omit in toc -->
# [Research] Location Library Recommendation 🗺️
**Created By:** Mohammad Ali Rafli (MAR)  
**Created:** 2026-07-15 | **Last Updated:** 2026-07-16  
**Document Status:** On-Progress  

<!-- omit in toc -->
## Table of Contents
- [1. Introduction](#1-introduction)
- [2. Project Requirements \& Constraints](#2-project-requirements--constraints)
- [3. Libraries Candidates](#3-libraries-candidates)
- [4. Comparative Analysis](#4-comparative-analysis)
  - [Perbandingan libraries berdasarkan kriteria](#perbandingan-libraries-berdasarkan-kriteria)
  - [Point Per-Library](#point-per-library)
- [5. Conclusion \& Recommendations](#5-conclusion--recommendations)
  - [Rekomendasi: **React Leaflet** (di atas Leaflet.js sebagai engine)](#rekomendasi-react-leaflet-di-atas-leafletjs-sebagai-engine)
- [6. Step-By-Step Implementation  React Leaflet](#6-step-by-step-implementation--react-leaflet)
- [References](#references)

## 1. Introduction
kebutuhan untuk bisa **Pin Point** coordinate yang dipilih oleh user dengan maps (UI) 

## 2. Project Requirements & Constraints
* **Tech Stack:** Next.js TypeScript (Web Based)
* **Fitur Utama:** Pin Point Coordinate (UI)
* **Budget Constrain:** free/open-sources

## 3. Libraries Candidates
| Libraries | Latest Version (Last Updated) | Pros 🟢 | Cons 🔴 |
| :--- | :--- | :--- | :--- |
| [Leaflet.js](https://leafletjs.com/index.html) | [v1.9.4 (16 Agu 2025)](<https://www.npmjs.com/package/leaflet>) | • Stabil & matang, API jarang berubah/minim breaking change<br>• Komunitas plugin sangat luas & lama<br>• Sudah dianggap "complete" untuk kebutuhan dasar pin point | • Update terakhir sudah ~11 bulan, pengembangan aktif melambat<br>• Berisiko tertinggal untuk fitur modern (WebGL, vector tiles) |
| [React Leaflet](https://react-leaflet.js.org/) | [v5.0.0 (14 Des 2024)](<https://www.npmjs.com/package/react-leaflet>) | • Wrapper resmi & ringan di atas Leaflet<br>• Native TypeScript support | • Update paling lama di antara 4 kandidat (~19 bulan), rilis cadence rendah<br>• Maintenance sangat bergantung pada update Leaflet core |
| [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) | [v5.24.0 (15 Jul 2026)](<https://www.npmjs.com/package/maplibre-gl>) | • Update paling aktif & sering (rilis terbaru hari ini)<br>• Pengembangan cepat, didukung banyak kontributor korporat (fork dari Mapbox GL JS)<br>• Fitur terus bertambah (WebGPU support, dll) | • Rilis sangat sering → risiko breaking changes antar versi minor lebih tinggi<br>• Perlu effort ekstra untuk re-test tiap upgrade |
| [react-map-gl (MapLibre)](https://visgl.github.io/react-map-gl/) | [v8.1.1 (11 Apr 2026)](<https://www.npmjs.com/package/react-map-gl?activeTab=versions>) | • Update relatif baru & rutin (~3 bulan lalu)<br>• Dikembangkan oleh tim vis.gl (OpenJS/Uber), cukup terpercaya<br>• Mendukung multi-backend (Mapbox & MapLibre) | • Rilis tidak secepat MapLibre GL JS core, kadang lag mendukung fitur terbaru |

*sources: npm registry (cek `npm view <package> time.modified version`, per 15 Jul 2026), Dokumentasi resmi Leaflet, Bundlephobia, GitHub (Leaflet, MapLibre, vis.gl/react-map-gl)*


## 4. Comparative Analysis

### Perbandingan libraries berdasarkan kriteria

| Kriteria Evaluasi | [Leaflet.js](https://leafletjs.com/index.html) | [React Leaflet](https://react-leaflet.js.org/) | [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) | [react-map-gl (MapLibre)](https://visgl.github.io/react-map-gl/) |
| :--- | :--- | :--- | :--- | :--- |
| **License & Cost** | BSD 2-Clause (100% Gratis) | Hippocratic 2.1 (100% Gratis, lisensi etis) | BSD 3-Clause (100% Gratis) | MIT (100% Gratis) |
| **Bundle Size** | Sangat Ringan (~42 KB gzipped) | Ringan (~3.4 KB wrapper, ~45 KB incl. Leaflet) | Besar (~268 KB gzipped) | Besar (~57 KB wrapper, ~324 KB incl. MapLibre) |
| **Next.js SSR Support** | Harus Dynamic Import (`ssr: false`) | Harus Dynamic Import (`ssr: false`) | Harus Dynamic Import (`ssr: false`) | Harus Dynamic Import (`ssr: false`) |
| **TypeScript Support** | Pihak Ketiga (`@types/leaflet`) | Bawaan (Native TypeScript) | Bawaan (Native TypeScript) | Bawaan (Native TypeScript) |
| **Performance (High Data)** | Rendah-Sedang (Melambat di >1k DOM markers) | Rendah-Sedang (Terbatas oleh arsitektur DOM Leaflet) | Sangat Tinggi (Akselerasi GPU via WebGL/WebGPU) | Sangat Tinggi (WebGL dengan manajemen state React) |
| **Learning Curve** | Rendah (Sangat mudah dipahami) | Rendah-Sedang (Perlu paham lifecycle React) | Sedang-Tinggi (Konsep Vector Tiles & Style JSON) | Sedang-Tinggi (Integrasi WebGL + State deklaratif React) |
| **Marker & Popup/Info Window Support** | Native (`L.Marker` + `bindPopup()`), mudah menampilkan detail outlet | Native via komponen `<Marker>` + `<Popup>`, deklaratif ala React | Native (`Marker` + `Popup` class), API imperative | Native via komponen `<Marker>` + `<Popup>`, deklaratif ala React |
| **Interactive Pin Placement (Click/Drag-to-Set Coordinate)** | Mudah, via event `map.on('click')` & opsi `draggable: true` pada marker | Mudah, via hook `useMapEvents({click})` & prop `draggable` | Mudah, via `map.on('click')` & opsi `draggable: true` pada `Marker` | Mudah, via event handler `onClick` pada `<Map>` & prop `draggable` pada `<Marker>` |
| **Geocoding/Search Address Support** | Tidak built-in, butuh plugin pihak ketiga (`leaflet-control-geocoder`) | Tidak built-in, butuh wrapper plugin geocoder (kompatibilitas React perlu effort ekstra) | Tidak built-in, butuh plugin tambahan (`maplibre-gl-geocoder`) | Tidak built-in, butuh plugin tambahan (`maplibre-gl-geocoder` + custom control React) |
| **Marker Clustering (Banyak Outlet)** | Butuh plugin tambahan (`leaflet.markercluster`), sudah matang & banyak dipakai | Butuh plugin tambahan (`react-leaflet-cluster`/`react-leaflet-markercluster`) | Native via GeoJSON `cluster` option pada source, performa tinggi tanpa plugin | Native (mengandalkan clustering GeoJSON MapLibre), perlu sedikit setup manual di React |
| **Custom Marker Icon** | Mudah, via `L.icon()`/`L.divIcon()` untuk custom image atau HTML/CSS | Mudah, via prop `icon` pada `<Marker>` (pakai `L.icon`/`L.divIcon`) | Mudah, marker berupa elemen HTML/DOM bebas (bisa pakai SVG/CSS apa saja) | Mudah, `<Marker>` menerima `children` berupa elemen React/HTML bebas |

*source: Claude Sonnet 5 Thinking level Medium*

### Point Per-Library
point diambil berdasarkan tabel comparative analysis diatas. dinilai dari angka 0-2. (0 = tidak bagus, 1 = cukup bagus, 2 = sangat bagus)

| Kriteria Evaluasi | [Leaflet.js](https://leafletjs.com/index.html) | [React Leaflet](https://react-leaflet.js.org/) | [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) | [react-map-gl (MapLibre)](https://visgl.github.io/react-map-gl/) |
| :--- | :--- | :--- | :--- | :--- |
| **License & Cost** | 2 | 2 | 2 | 2 |
| **Bundle Size** | 2 | 2 | 0 | 0 |
| **Next.js SSR Support** | 0 | 0 | 0 | 0 |
| **TypeScript Support** | 1 | 2 | 2 | 2 |
| **Performance (High Data)** | 1 | 1 | 2 | 2 |
| **Learning Curve** | 2 | 2 | 1 | 1 |
| **Marker & Popup/Info Window Support** | 2 | 2 | 2 | 2 |
| **Interactive Pin Placement (Click/Drag-to-Set Coordinate)** | 2 | 2 | 2 | 2 |
| **Geocoding/Search Address Support** | 0 | 0 | 0 | 0 |
| **Marker Clustering (Banyak Outlet)** | 1 | 1 | 2 | 1 |
| **Custom Marker Icon** | 2 | 2 | 2 | 2 |
| **Total** | 15 | 16 | 15 | 14 |

*Penilaian berdasarkan Opini Penulis*

> **Catatan Koreksi Skor dari AI:**
> - **Bundle Size** MapLibre GL JS & react-map-gl dikoreksi dari `1` → `0`. Deskripsi faktual di tabel sebelumnya menyebut kategori **"Besar"** (~268-324 KB, 6-7x lebih berat dari Leaflet). Pada skala 0-2 (0=tidak bagus, 1=cukup bagus, 2=sangat bagus), kategori "Besar" lebih tepat masuk ke `0`, terutama karena komponen map wajib di-*dynamic-import* client-side di Next.js sehingga langsung menambah initial JS payload.
> - **Marker Clustering** Leaflet.js dikoreksi dari `2` → `1`. Deskripsi faktual menyebut Leaflet.js "**butuh plugin tambahan**" (`leaflet.markercluster`), bukan native — skornya semula disamakan dengan MapLibre GL JS yang genuinely native tanpa plugin. Setelah dikoreksi, skor Leaflet.js kini konsisten dengan React Leaflet yang juga "butuh plugin tambahan".  
> *source: Claude Sonnet 5 Thinking level Medium*

## 5. Conclusion & Recommendations

**Final Score Summary:**

| Library Ecosystem | Komponen | Total Score |
| :--- | :--- | :---: |
| **Leaflet + React Leaflet** | Leaflet.js (engine) + React Leaflet (wrapper) | **15 + 16** |
| MapLibre GL JS + react-map-gl | MapLibre GL JS (engine) + react-map-gl (wrapper) | 15 + 14 |

> Catatan: Karena project ini berbasis Next.js/React, engine (Leaflet.js / MapLibre GL JS) tidak akan dipakai sendirian — pasti didampingi wrapper React-nya (React Leaflet / react-map-gl). Maka perbandingan yang relevan untuk keputusan akhir adalah **skor wrapper React-nya**: **React Leaflet (16)** vs **react-map-gl (14)**.

### Rekomendasi: **React Leaflet** (di atas Leaflet.js sebagai engine)

Justifikasi:

1. **Total skor tertinggi** di antara 4 kandidat setelah koreksi (16 poin) — unggul di TypeScript support native, performance yang cukup untuk kebutuhan saat ini, dan bundle size yang ringan.
2. **Kebutuhan saat ini masih sederhana** — fitur utama section 2 hanya "Pin Point Coordinate (UI)", belum butuh visualisasi data besar atau vector tiles custom. Keunggulan WebGL/WebGPU pada MapLibre GL JS belum relevan dipakai sekarang, sehingga tidak sebanding dengan overhead bundle size-nya (~324 KB vs ~45 KB).
3. **Bundle size jauh lebih ringan** (~45 KB vs ~324 KB) → penting untuk performa Next.js app, mengingat komponen map wajib di-*dynamic-import* (`ssr: false`) sehingga langsung menambah initial JS payload di client.
4. **Learning curve lebih rendah & integrasi lifecycle React yang deklaratif** (`<MapContainer>`, `<Marker>`, `<Popup>`, hook `useMapEvents`) — lebih cepat untuk development & lebih mudah dimaintain tim, dibanding harus memahami konsep Vector Tiles & Style JSON di MapLibre.
5. **Kebutuhan skala ke depan (ribuan outlet) tetap dapat diakomodasi** melalui pola **marker clustering** (`react-leaflet-cluster`) — user zoom in untuk melihat detail per outlet, cluster ditampilkan di level zoom rendah. Pola ini sudah matang & banyak dipakai untuk kasus store-locator/outlet map skala besar, sehingga kelemahan performa DOM-based Leaflet pada ribuan marker individual dapat dimitigasi tanpa perlu pindah ke MapLibre.
6. **SSR handling & Geocoding** butuh effort tambahan yang sama di semua kandidat (skor 0 di semua kolom untuk kedua kriteria ini), sehingga bukan faktor pembeda keputusan.

**Catatan untuk masa depan (Migration Trigger):** Pertimbangkan migrasi ke MapLibre GL JS + react-map-gl apabila salah satu kondisi berikut terpenuhi:
- Kebutuhan menampilkan **ribuan marker individual sekaligus tanpa clustering** (misal semua titik harus terlihat terpisah di level zoom rendah).
- Kebutuhan **styling map yang sangat custom** (vector tiles, tema map kustom di luar tile provider standar).
- Kebutuhan fitur **3D / WebGPU** atau visualisasi geospasial tingkat lanjut.

## 6. Step-By-Step Implementation  React Leaflet
Lihat panduan implementasi lengkap di [docs/react-leaflet.md](./docs/react-leaflet.md).

## References
- [Leaflet.js — Official Documentation](https://leafletjs.com/index.html)
- [React Leaflet — Official Documentation](https://react-leaflet.js.org/)
- [MapLibre GL JS — Official Documentation](https://maplibre.org/maplibre-gl-js/docs/)
- [react-map-gl — Official Documentation (vis.gl)](https://visgl.github.io/react-map-gl/)
- [leaflet.markercluster — Plugin](https://github.com/Leaflet/Leaflet.markercluster)
- [react-leaflet-cluster — Plugin](https://www.npmjs.com/package/react-leaflet-cluster)
- npm registry version & update history (`npm view <package> time.modified version`), diakses 15 Jul 2026
