"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { Building } from "@/types/building";

export default function CampusMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [search, setSearch] = useState("");

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const newMap = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [-81.2001, 28.6024],
      zoom: 15.5,
      pitch: 45,
    });

    newMap.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    newMap.addLayer({
      id: "ucf-3d-building",
      type: "fill-extrusion",
      source: "ucf-building",
      paint: {
        "fill-extrusion-color": "#D4017",
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": 0.85,
      }
    })

    map.current = newMap;

    return () => {
      newMap.remove();
      map.current = null;
    };
  }, []);

  // Fetch buildings from API
  useEffect(() => {
    async function fetchBuildings() {
      try {
        const response = await fetch("/api/buildings");

        if (!response.ok) {
          throw new Error("Failed to fetch buildings");
        }

        const data: Building[] = await response.json();

        setBuildings(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBuildings();
  }, []);

  // Display building markers
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    buildings.forEach((building) => {
      const popupContent = document.createElement("div");

      const title = document.createElement("h3");
      title.textContent = building.name;
      title.style.fontWeight = "bold";

      const code = document.createElement("p");
      code.textContent = `Building: ${building.code}`;

      const description = document.createElement("p");
      description.textContent = building.description ?? "";

      popupContent.append(title, code, description);

      const popup = new maplibregl.Popup({
        offset: 25,
      }).setDOMContent(popupContent);

      const marker = new maplibregl.Marker({
        color: "#FFC904",
      })
        .setLngLat([
          building.longitude,
          building.latitude,
        ])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
    };
  }, [buildings]);

  // Search and focus on building
  function handleSearch(building: Building) {
    if (!map.current) return;

    map.current.flyTo({
      center: [
        building.longitude,
        building.latitude,
      ],
      zoom: 18,
      essential: true,
    });

    setSearch(building.name);
  }

  const filteredBuildings = buildings.filter((building) => {
    const query = search.toLowerCase();

    return (
      building.name.toLowerCase().includes(query) ||
      building.code.toLowerCase().includes(query)
    );
  });

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />

      {/* Building search */}
      <div className="absolute left-4 top-4 z-10 w-72 rounded-lg bg-white p-3 shadow-lg">
        <input
          type="text"
          placeholder="Search UCF buildings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border p-2 text-black"
        />

        {search && (
          <div className="mt-2 max-h-60 overflow-y-auto">
            {filteredBuildings.map((building) => (
              <button
                key={building.id}
                onClick={() => handleSearch(building)}
                className="block w-full rounded p-2 text-left text-black hover:bg-gray-100"
              >
                {building.name}
                <span className="ml-2 text-sm text-gray-500">
                  {building.code}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}