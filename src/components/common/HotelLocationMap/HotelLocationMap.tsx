"use client";

import React, { useMemo } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface HotelLocationMapProps {
  latitude: number;
  longitude: number;
  hotelName?: string | null;
}

const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;

const HotelLocationMap: React.FC<HotelLocationMapProps> = ({
  latitude,
  longitude,
  hotelName,
}) => {
  const coordinates = useMemo(() => ({ latitude, longitude }), [latitude, longitude]);
// console.log("mapboxAccessToken", mapboxAccessToken);
// console.log("coordinates", coordinates);
  if (
    !mapboxAccessToken ||
    !Number.isFinite(coordinates.latitude) ||
    !Number.isFinite(coordinates.longitude)
  ) {
    return null;
  }

  return (
    <div className="hotel-location-map">
      <Map
        reuseMaps
        mapboxAccessToken={mapboxAccessToken}
        initialViewState={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          zoom: 14,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
        dragRotate={false}
      >
        <Marker
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
          anchor="bottom"
        >
          <div
            className="hotel-location-map__marker"
            role="img"
            aria-label={hotelName ? `${hotelName} location` : "Hotel location"}
          >
            <span className="hotel-location-map__marker-inner" aria-hidden />
          </div>
        </Marker>
        <div className="hotel-location-map__controls">
          <NavigationControl visualizePitch showCompass={false} />
        </div>
      </Map>
    </div>
  );
};

export default HotelLocationMap;


