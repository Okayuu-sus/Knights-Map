import type { Building } from "@prisma/client";
import { BuildingMessage } from "next/dist/server/dev/hot-reloader-types";

type Geometry = {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
}


function isGeometry(value: unknown): value is Geometry {
    if (
        typeof value !== "object" ||
        value === null
    ) {
        return false;
    }

    const geometry = value as Record<string, unknown>;

    return (
        (geometry.type === "Polygon" || 
            geometry.type === "MultiPolygon") &&
        Array.isArray(geometry.coordinates)
    )
}


export function buildingsToGeoJSON(buildings: Building[]) {
    return {
        type: "FeatureCollection" as const,
        
        features: buildings
        .filter((building) => 
            isGeometry(building.footprint)
        )
        .map((building) => ({
            type: "Feature" as const,

            geometry: building.footprint as Geometry,

            properties: {
                id: building.id,
                code: building.code,
                name: building.name,
                description: building.description,
                height: building.height ?? 10,
                floors: building.floors,
                longitude: building.longitude,
                latitude: building.latitude,
            }
        }))
    }
}