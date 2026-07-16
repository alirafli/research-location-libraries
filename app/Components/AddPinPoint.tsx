"use client";

import { useState, useCallback, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

interface Pin {
  id: string;
  lat: number;
  lng: number;
}

function ClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapFlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo(target, map.getZoom() < 13 ? 14 : map.getZoom(), {
        duration: 1,
      });
    }
  }, [map, target]);

  return null;
}

const iconDefault = L.icon({
  iconUrl: "/marker-icon-custom.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const iconSelected = L.icon({
  iconUrl: "/marker-icon-custom.png",
  iconSize: [35, 51],
  iconAnchor: [17, 51],
  popupAnchor: [1, -34],
  shadowSize: [51, 51],
});

function PinCard({
  pin,
  isSelected,
  onSelect,
  onRemove,
}: {
  pin: Pin;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const lat = pin.lat.toFixed(5);
  const lng = pin.lng.toFixed(5);
  const thumbUrl = `https://staticmap.openstreetmap.de/staticmap?center=${lat},${lng}&zoom=14&size=280x180&markers=${lat},${lng},red-pushpin`;

  return (
    <div
      className={`border rounded overflow-hidden cursor-pointer transition ${
        isSelected ? "ring-2 ring-blue-500" : "hover:shadow"
      }`}
      onClick={onSelect}
    >
      {imgError ? (
        <div className="w-full h-36 flex items-center justify-center bg-gray-100 text-gray-400">
          <div className="text-center">
            <span className="text-2xl">📍</span>
            <p className="text-xs mt-1">
              {lat}, {lng}
            </p>
          </div>
        </div>
      ) : (
        // akan ada pendekatan yang lebih baik nantinya, menggunakan Image dari nextjs
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbUrl}
          alt={`Map ${lat}, ${lng}`}
          className="w-full h-36 object-cover"
          onError={() => setImgError(true)}
        />
      )}
      <div className="p-2">
        <p className="text-xs font-mono">
          {lat}, {lng}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-xs text-red-500 mt-1"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}

export default function AddPinPoint() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    const newPin: Pin = { id: crypto.randomUUID(), lat, lng };
    setPins((prev) => [...prev, newPin]);
  }, []);

  const removePin = useCallback((id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const selectedPin = pins.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600">
        Klik di peta untuk menambahkan pin. Klik pin untuk memilihnya.
      </p>

      <MapContainer center={[-7.3, 110.5]} zoom={8} className="h-125 w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup chunkedLoading>
          <ClickHandler onMapClick={handleMapClick} />
          <MapFlyTo target={flyTo} />
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={pin.id === selectedId ? iconSelected : iconDefault}
              eventHandlers={{
                click: () => setSelectedId(pin.id),
              }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {selectedPin && (
        <div className="border rounded p-4 bg-blue-50">
          <h3 className="font-semibold mb-1">Pin Terpilih</h3>
          <p className="text-sm">
            {selectedPin.lat.toFixed(6)}, {selectedPin.lng.toFixed(6)}
          </p>
          <button
            onClick={() => removePin(selectedPin.id)}
            className="mt-2 text-sm text-red-600 underline"
          >
            Hapus pin ini
          </button>
        </div>
      )}

      <div className="border rounded p-4">
        <h3 className="font-semibold mb-3">Daftar Pin ({pins.length})</h3>
        {pins.length === 0 ? (
          <p className="text-sm text-gray-400">
            Belum ada pin. Klik peta untuk menambah.
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pins.map((pin) => (
              <PinCard
                key={pin.id}
                pin={pin}
                isSelected={pin.id === selectedId}
                onSelect={() => {
                  setSelectedId(pin.id);
                  setFlyTo([pin.lat, pin.lng]);
                }}
                onRemove={() => removePin(pin.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
