'use client';

import 'leaflet/dist/leaflet.css';



import { useEffect, useState } from 'react';

type Coords = { lat: number; lng: number };

interface LocationMapProps {
  onConfirm: (coords: Coords) => void;
}

export default function LocationMap({ onConfirm }: LocationMapProps) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [address, setAddress] = useState('');
  const [markerIcon, setMarkerIcon] = useState<any>(null);

  // react-leaflet components (loaded dynamically)
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    // load react-leaflet ONLY in browser
    Promise.all([import('react-leaflet'), import('leaflet')]).then(
      ([RL, L]) => {
        setLeaflet(RL);

        const icon = new L.Icon({
          iconUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
        setMarkerIcon(icon);
      }
    );

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const c = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCoords(c);
          setAddress(`${c.lat.toFixed(6)}, ${c.lng.toFixed(6)}`);
        },
        () => alert('Location access denied!')
      );
    }
  }, []);

  if (!coords || !markerIcon || !leaflet) {
    return <p>লোকেশন লোড হচ্ছে...</p>;
  }

  const {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
  } = leaflet;

  const RecenterMap = ({ coords }: { coords: Coords }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(coords, map.getZoom());
    }, [coords, map]);
    return null;
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="mb-2">
        <input
          value={address}
          readOnly
          className="w-full border px-3 py-2 rounded bg-blue-200 text-black"
        />
        <small className="text-gray-500">Format: lat,lng</small>
      </div>

      <div className="flex-1">
        <MapContainer center={coords} zoom={15} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap coords={coords} />
          <Marker
            position={coords}
            draggable
            icon={markerIcon}
            eventHandlers={{
              dragend: (e: { target: { getLatLng: () => any; }; }) => {
                const p = e.target.getLatLng();
                setCoords(p);
                setAddress(`${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}`);
              },
            }}
          >
            <Popup>Drag your location 🗺️</Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="mt-2 flex justify-center">
        <button
          onClick={() => onConfirm(coords)}
          className="px-5 py-2 bg-green-500 text-white rounded"
        >
          CONFIRM LOCATION
        </button>
      </div>
    </div>
  );
}
