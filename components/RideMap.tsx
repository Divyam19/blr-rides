"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

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

const userIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface MapBoundsProps {
  startLat?: number | null
  startLng?: number | null
  endLat?: number | null
  endLng?: number | null
  userLocations?: Array<{ lat: number; lng: number; userId: string; userName: string }>
}

function MapBounds({ startLat, startLng, endLat, endLng, userLocations }: MapBoundsProps) {
  const map = useMap()

  useEffect(() => {
    const bounds: L.LatLngExpression[] = []

    if (startLat && startLng) {
      bounds.push([startLat, startLng])
    }
    if (endLat && endLng) {
      bounds.push([endLat, endLng])
    }
    if (userLocations && userLocations.length > 0) {
      userLocations.forEach((loc) => {
        bounds.push([loc.lat, loc.lng])
      })
    }

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, startLat, startLng, endLat, endLng, userLocations])

  return null
}

interface RideMapProps {
  startLat?: number | null
  startLng?: number | null
  endLat?: number | null
  endLng?: number | null
  routePolyline?: string | null
  userLocations?: Array<{ lat: number; lng: number; userId: string; userName: string }>
  height?: string
}

export function RideMap({
  startLat,
  startLng,
  endLat,
  endLng,
  routePolyline,
  userLocations = [],
  height = "400px",
}: RideMapProps) {
  const defaultCenter: [number, number] = [12.9716, 77.5946] // Bangalore

  const routeCoordinates: [number, number][] = []
  if (startLat && startLng && endLat && endLng) {
    routeCoordinates.push([startLat, startLng], [endLat, endLng])
  }

  // Decode polyline if provided (simplified - you might want to use a library like @mapbox/polyline)
  // For now, we'll just draw a straight line between start and end

  return (
    <div className="w-full rounded-lg overflow-hidden border" style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds
          startLat={startLat}
          startLng={startLng}
          endLat={endLat}
          endLng={endLng}
          userLocations={userLocations}
        />
        {startLat && startLng && (
          <Marker position={[startLat, startLng] as [number, number]} icon={startIcon}>
            <Popup>Start Location</Popup>
          </Marker>
        )}
        {endLat && endLng && (
          <Marker position={[endLat, endLng] as [number, number]} icon={endIcon}>
            <Popup>End Location</Popup>
          </Marker>
        )}
        {routeCoordinates.length > 0 && (
          <Polyline
            positions={routeCoordinates}
            color="#3b82f6"
            weight={4}
            opacity={0.7}
          />
        )}
        {userLocations.map((location) => (
          <Marker
            key={location.userId}
            position={[location.lat, location.lng] as [number, number]}
            icon={userIcon}
          >
            <Popup>{location.userName}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

