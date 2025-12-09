"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet varsayılan ikon hatasını düzeltme
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  center: [number, number];
  zoom?: number;
}

export default function ListingMap({ center, zoom = 13 }: MapProps) {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border z-0">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={icon}>
          <Popup>
            İlan Konumu <br /> Tahmini bölge gösterilmektedir.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}