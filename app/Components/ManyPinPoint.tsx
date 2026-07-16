"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { locations } from "./data";

const ManyPinPoint = () => {
  const customIcon = L.icon({
    iconUrl: "/marker-icon-custom.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <MapContainer center={[-7.3, 110.5]} zoom={8} className="h-150 w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>
        {locations.map((loc) => (
          <Marker key={loc.id} position={loc.coords} icon={customIcon}>
            <Popup>
              <b>{loc.name}</b>
              <br />
              {loc.coords[0].toFixed(4)}, {loc.coords[1].toFixed(4)}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default ManyPinPoint;
