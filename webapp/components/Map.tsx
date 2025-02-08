"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style:
          "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/standard.json", //Fond de carte
      center: [2.213749, 46.227638],
      zoom: 5,
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return <div ref={mapContainer} className="w-full h-[calc(100vh-8rem)]" />;
}
