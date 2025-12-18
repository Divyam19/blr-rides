"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in react-leaflet
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const startIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const endIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface MapPickerProps {
  startPosition: { lat: number; lng: number } | null
  endPosition: { lat: number; lng: number } | null
  onStartSelect: (position: { lat: number; lng: number }) => void
  onEndSelect: (position: { lat: number; lng: number }) => void
  mode: "start" | "end"
  onModeChange: (mode: "start" | "end") => void
}

function MapClickHandler({
  onStartSelect,
  onEndSelect,
  mode,
}: {
  onStartSelect: (position: { lat: number; lng: number }) => void
  onEndSelect: (position: { lat: number; lng: number }) => void
  mode: "start" | "end"
}) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      if (mode === "start") {
        onStartSelect({ lat, lng })
      } else {
        onEndSelect({ lat, lng })
      }
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return null
}

export function MapPicker({
  startPosition,
  endPosition,
  onStartSelect,
  onEndSelect,
  mode,
  onModeChange,
}: MapPickerProps) {
  const [center, setCenter] = useState<[number, number]>([12.9716, 77.5946]) // Bangalore default

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude])
        },
        () => {
          // Default to Bangalore if geolocation fails
          setCenter([12.9716, 77.5946])
        }
      )
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onModeChange("start")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "start"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Select Start Point
        </button>
        <button
          type="button"
          onClick={() => onModeChange("end")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "end"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Select End Point
        </button>
      </div>
      <div className="h-[400px] w-full rounded-lg overflow-hidden border">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler
            onStartSelect={onStartSelect}
            onEndSelect={onEndSelect}
            mode={mode}
          />
          {startPosition && (
            <Marker position={startPosition} icon={startIcon} />
          )}
          {endPosition && (
            <Marker position={endPosition} icon={endIcon} />
          )}
        </MapContainer>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>Click on the map to select the {mode === "start" ? "start" : "end"} location</p>
        {startPosition && (
          <p className="mt-1">
            Start: {startPosition.lat.toFixed(4)}, {startPosition.lng.toFixed(4)}
          </p>
        )}
        {endPosition && (
          <p className="mt-1">
            End: {endPosition.lat.toFixed(4)}, {endPosition.lng.toFixed(4)}
          </p>
        )}
      </div>
    </div>
  )
}

