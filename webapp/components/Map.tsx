"use client";

import {useCallback, useEffect, useRef} from "react";

import ReactMapGl, {MapRef} from "react-map-gl/maplibre";
import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {Protocol} from "pmtiles";
import layers from "protomaps-themes-base";
import {Leva, useControls} from "leva";

const SOURCE = "protomaps";
const OVERLAY_SOURCE = "communes";
const OVERLAY_LAYER = "communes-layer";

export default function Map() {
    const mapRef = useRef<MapRef>(null);
    const hoveredElementRef = useRef<number | string | undefined>(undefined);

    // controls from Leva is a library for adding a GUI to help us try out different styles.
    // we're going to discard it once designers make a decision on the map style
    const {
        theme,
        language,
        customizeCountryBorders,
        countryBorderWidth,
        countryBorderColor,
        customizeRegionBorders,
        regionBorderWidth,
        regionBorderColor,
        regionDashline,
    } = useControls({
        theme: {
            options: ["light", "dark", "white", "grayscale", "black"],
            value: "white",
        },
        language: {
            options: ["en", "fr"],
            value: "fr",
        },
        // country
        customizeCountryBorders: {
            value: true,
        },
        countryBorderWidth: {
            value: 3,
            min: 1,
            max: 10,
            step: 1,
            render: (get) => get("customizeCountryBorders"),
        },
        countryBorderColor: "#bdb8b8",
        // region
        customizeRegionBorders: {
            value: true,
        },
        regionBorderWidth: {
            value: 2,
            min: 1,
            max: 8,
            step: 1,
            render: (get) => get("customizeRegionBorders"),
        },
        regionBorderColor: "#d7d7d7",
        regionDashline: {
            value: true,
            render: (get) => get("customizeRegionBorders"),
        },
    });

    useEffect(() => {
        const protocol = new Protocol();
        maplibregl.addProtocol("pmtiles", protocol.tile);
        return () => {
            maplibregl.removeProtocol("pmtiles");
        };
    }, []);


    const onMapLoad = useCallback(() => {
        const map = mapRef.current;

        if (map) {
            map.on('mousemove', OVERLAY_LAYER, (e) => {
                if (e.features && e.features.length > 0) {
                    console.log('e.features', e.features);

                    if (hoveredElementRef.current !== null && typeof hoveredElementRef.current !== 'undefined') {
                        // clear previous hovered state
                        map.setFeatureState(
                            {source: OVERLAY_SOURCE, id: hoveredElementRef.current, sourceLayer: OVERLAY_SOURCE},
                            {hover: false}
                        );
                    }
                    const hoveredId = e.features[0].id;
                    if (typeof hoveredId !== 'undefined') {
                        hoveredElementRef.current = hoveredId;
                        map.setFeatureState(
                            {source: OVERLAY_SOURCE, id: hoveredId, sourceLayer: OVERLAY_SOURCE},
                            {hover: true}
                        );
                    }
                }
            });

            map.on('mouseleave', OVERLAY_LAYER, () => {
                if (typeof hoveredElementRef.current !== 'undefined') {
                    // clear previous hovered state
                    map.setFeatureState(
                        {source: OVERLAY_SOURCE, id: hoveredElementRef.current, sourceLayer: OVERLAY_SOURCE},
                        {hover: false}
                    );
                    hoveredElementRef.current = undefined;
                }
            });
        }
    }, []);

    return (
        <>
            <ReactMapGl
              ref={mapRef}
              onLoad={onMapLoad}
              style={{width: "100%", height: "90vh"}}
              mapStyle={{
                version: 8,
                glyphs:
                  "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
                sprite:
                  "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
                sources: {
                  protomaps: {
                    type: "vector",
                    maxzoom: 15,
                    url: "https://api.protomaps.com/tiles/v4.json?key=707d8bc70b393fc0",
                    attribution:
                      '<a href="https://osm.org/copyright">© OpenStreetMap</a>',
                  },
                  [OVERLAY_SOURCE]: {
                    type: "vector",
                    url: "pmtiles://communes.pmtiles",
                    // set the feature id as the commune code
                    promoteId: 'commune_code_insee'
                  }
                },
                layers: [
                  ...layers(SOURCE, theme, language).filter(
                    (layer) =>
                      ![
                        customizeCountryBorders ? "boundaries_country" : undefined,
                        customizeRegionBorders ? "places_region" : undefined,
                      ].includes(layer.id),
                  ),
                  ...(customizeCountryBorders
                    ? [
                      {
                        id: "boundaries_country",
                        type: "line",
                        source: SOURCE,
                        "source-layer": "boundaries",
                        filter: ["<=", "kind_detail", 2],
                        paint: {
                          "line-color": countryBorderColor,
                          "line-width": countryBorderWidth,
                        },
                      } satisfies maplibregl.LayerSpecification,
                    ]
                    : []),
                  ...(customizeRegionBorders
                    ? [
                      {
                        id: "places_region",
                        type: "line",
                        source: SOURCE,
                        "source-layer": "boundaries",
                        filter: ["==", "kind", "region"],
                        paint: {
                          "line-color": regionBorderColor,
                          "line-width": regionBorderWidth,
                          ...(regionDashline && {"line-dasharray": [2, 3]}),
                        },
                      } satisfies maplibregl.LayerSpecification,
                    ]
                    : []),
                ],
              }}
              initialViewState={{
                longitude: 2.213749,
                latitude: 46.227638,
                zoom: 5,
              }}
              mapLib={maplibregl}
              onClick={(e) => {
                console.log(e);
              }}
            >
              <DeckGL
                layers={[
                  new GeoJsonLayer({
                    id: OVERLAY_LAYER,
                    data: "georef-france-commune-prelevement.geojson",
                    filled: true,
                    getFillColor: [8, 136, 136, 128],
                    pickable: true,
                    autoHighlight: true,
                    highlightColor: [8, 136, 136, 255],
                    onHover: ({object}) => {
                      if (object) {
                        hoveredElementRef.current = object.properties.commune_code_insee;
                      } else {
                        hoveredElementRef.current = undefined;
                      }
                    },
                  }),
                ]}
                getTooltip={({object}) => object && `Commune: ${object.properties.commune_code_insee}`}
              />
            </ReactMapGl>
            {/* TODO: remove this once the design decision is made */}
            <Leva oneLineLabels/>
        </>
    );
}
