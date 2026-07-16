"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Components/Map"), { ssr: false });
const ManyPinPoint = dynamic(() => import("./Components/ManyPinPoint"), {
  ssr: false,
});
const AddPinPoint = dynamic(() => import("./Components/AddPinPoint"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="flex flex-col gap-8 p-4 px-20">
      <h1>First Map Setup</h1>
      <Map />

      <h1>Implementasi Clustering ketika Pin banyak dan berdempetan</h1>
      <ManyPinPoint />

      <h1>Menambahkan Pin ke Peta</h1>
      <AddPinPoint />
    </div>
  );
}
