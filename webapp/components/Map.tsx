"use client";

import {useCallback, useEffect, useRef} from "react";

import ReactMapGl, {Layer, MapRef} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {Protocol} from "pmtiles";
import layers from "protomaps-themes-base";
import {Leva, useControls} from "leva";

const SOURCE = "protomaps";

interface MapProps {
    data?: any;
}

export default function Map({data}: MapProps) {
    const mapRef = useRef<MapRef>(null);
    const hoveredCommuneRef = useRef<number | string | undefined>(undefined);

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
            map.on('mousemove', 'commune', (e) => {
                if (e.features && e.features.length > 0) {
                    console.log('e.features', e.features);

                    if (hoveredCommuneRef.current !== null && hoveredCommuneRef.current) {
                        // clear previous hovered state
                        map.setFeatureState(
                            {source: 'commune', id: hoveredCommuneRef.current},
                            {hover: false}
                        );
                    }
                    const hoveredCommune = e.features[0].id;
                    if (hoveredCommune) {
                        hoveredCommuneRef.current = hoveredCommune;
                        map.setFeatureState(
                            {source: 'commune', id: hoveredCommune},
                            {hover: true}
                        );
                    }
                }
            });

            map.on('mouseleave', 'commune', (e) => {
                if (hoveredCommuneRef.current !== null) {
                    // clear previous hovered state
                    map.setFeatureState(
                        {source: 'commune', id: hoveredCommuneRef.current},
                        {hover: false}
                    );
                }
            });
        }
    }, []);

    console.log('layers(SOURCE, "white", "en")', layers(SOURCE, "white", "en"));
    console.log('data', data);

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
                        commune: {
                            type: "geojson",
                            data,
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
                <Layer
                    id="commune"
                    type="fill"
                    source="commune"
                    paint={{
                        'fill-color': '#088',
                        'fill-opacity': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            1,
                            0.5
                        ]
                    }}
                />

            </ReactMapGl>
            {/* TODO: remove this once the design decision is made */}
            <Leva oneLineLabels/>
        </>
    );
}
