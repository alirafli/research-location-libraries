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
