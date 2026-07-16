"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Components/Map"), { ssr: false });
const ManyPinPoint = dynamic(() => import("./Components/ManyPinPoint"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <h1>First Map Setup</h1>
      <Map />

      <h1>Many Pin Points</h1>
      <ManyPinPoint />
    </>
  );
}
