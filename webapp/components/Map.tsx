"use client";

import { useEffect } from "react";

import ReactMapGl from 'react-map-gl/maplibre';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import layers from 'protomaps-themes-base';

const SOURCE = "protomaps";

export default function Map() {
  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    return () => {
      maplibregl.removeProtocol("pmtiles");
    };
  }, []);

  return (
      <ReactMapGl
        style={{width: "100%", height: "90vh"}}
        mapStyle={{
          version: 8,
          glyphs: "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
          sprite: "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
          sources: {
            protomaps: {
              type: "vector",
              "maxzoom": 15,
              url: "https://api.protomaps.com/tiles/v4.json?key=707d8bc70b393fc0",
              "attribution": "<a href=\"https://osm.org/copyright\">© OpenStreetMap</a>",
            },
          },
          layers: [
            ...layers(SOURCE, "white", "en").filter(
              (layer) => !["boundaries_country", "places_region"].includes(layer.id)
            ),
            {
                "id": "boundaries_country",
                "type": "line",
                "source": SOURCE,
                "source-layer": "boundaries",
                "filter": ['<=', 'kind_detail', 2],
                paint: {
                  "line-color": "#999",
                  "line-width": 2
                }
            },
            {
              "id": "places_region",
              "type": "line",
              "source": SOURCE,
              "source-layer": "boundaries",
              "filter": ['==', 'kind', 'region'],
              paint: {
                "line-color": "#aaaaa0",
                "line-width": 1
              }
            }
          ]
      }}
        initialViewState={{
          longitude: 2.213749,
          latitude: 46.227638,
          zoom: 6
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mapLib={maplibregl as any}
      />
  );
}
