"use client";

import { useEffect, useMemo } from "react";

import ReactMapGl from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import {
  MAPLIBRE_MAP,
  DEFAULT_MAP_STYLE,
  getDefaultLayers,
} from "@/app/config";

export default function Map() {
  useEffect(() => {
    // adds the support for PMTiles
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    return () => {
      maplibregl.removeProtocol("pmtiles");
    };
  }, []);

  // Combine the default style with dynamic layers
  const mapStyle = useMemo(() => {
    // We can add dynamic layers here in the future
    const dynamicLayers: maplibregl.LayerSpecification[] = [];

    return {
      ...DEFAULT_MAP_STYLE,
      layers: [...getDefaultLayers(), ...dynamicLayers],
    } as maplibregl.StyleSpecification;
  }, []);

  return (
    <ReactMapGl
      style={{ width: "100%", height: "100%" }}
      mapStyle={mapStyle}
      initialViewState={MAPLIBRE_MAP.initialViewState}
      mapLib={maplibregl}
    />
  );
}
