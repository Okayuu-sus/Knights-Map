import "dotenv/config";
import osmtogeojson from "osmtogeojson";
import {prisma} from "../lib/prisma";
import type { Prisma } from "@prisma/client";

// Approximate central UCF campus bounding box
const SOUTH = 28.590;
const WEST = -81.212;
const NORTH = 28.613;
const EAST = -81.188;

const query = `
[out:json][timeout:120];
(
  way["building"](${SOUTH},${WEST},${NORTH},${EAST});
  relation["building"](${SOUTH},${WEST},${NORTH},${EAST});
);
out body;
>;
out skel qt;
`;

type Position = number[];

type Geometry = {
  type: "Polygon" | "MultiPolygon";
  coordinates: Position[][] | Position[][][];
};

type OSMFeature = {
  id?: string | number;
  properties?: Record<string, string>;
  geometry: Geometry | null;
};

function getHeight(tags: Record<string, string>) {
  const rawHeight = tags.height;

  if (rawHeight) {
    const match = rawHeight
      .trim()
      .match(/^(\d+(?:\.\d+)?)\s*(m|ft|')?$/i);

    if (match) {
      const value = Number(match[1]);
      const unit = match[2]?.toLowerCase();

      if (value > 0) {
        return unit === "ft" || unit === "'"
          ? value * 0.3048
          : value;
      }
    }
  }

  const levels = Number(tags["building:levels"]);

  if (Number.isFinite(levels) && levels > 0) {
    return levels * 3.5;
  }

  // Fallback for missing OSM height information
  return 10;
}

function getCenter(geometry: Geometry) {
  const polygons =
    geometry.type === "Polygon"
      ? [geometry.coordinates as Position[][]]
      : (geometry.coordinates as Position[][][]);

  const points = polygons.flatMap(
    (polygon) => polygon[0] ?? []
  );

  const longitudes = points.map((point) => point[0]);
  const latitudes = points.map((point) => point[1]);

  return {
    longitude:
      (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
    latitude:
      (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
  };
}

async function main() {
  const response = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams({ data: query }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Overpass request failed: ${response.status}`
    );
  }

  const osmData = await response.json();
  const geojson = osmtogeojson(osmData);

  let imported = 0;

  for (const rawFeature of geojson.features) {
    const feature = rawFeature as OSMFeature;

    if (
      !feature.geometry ||
      !["Polygon", "MultiPolygon"].includes(
        feature.geometry.type
      )
    ) {
      continue;
    }

    const tags = feature.properties ?? {};
    const osmId = String(feature.id ?? "");

    if (!osmId) continue;

    const center = getCenter(feature.geometry);
    const height = getHeight(tags);

    const rawLevels = Number(tags["building:levels"]);
    const floors =
      Number.isInteger(rawLevels) && rawLevels > 0
        ? rawLevels
        : null;

    const code = `OSM_${osmId.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}`;

    const data = {
      code,
      name: tags.name || `Building ${osmId}`,
      description: tags.building || null,
      latitude: center.latitude,
      longitude: center.longitude,
      footprint: feature.geometry as Prisma.InputJsonValue,
      osmId,
      height,
      floors,
    };

    await prisma.building.upsert({
      where: { osmId },
      update: {
        name: data.name,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        footprint: data.footprint,
        height: data.height,
        floors: data.floors,
      },
      create: data,
    });

    imported++;
  }

  console.log(`Imported ${imported} UCF building footprints.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });