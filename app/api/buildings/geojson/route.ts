import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { buildingsToGeoJSON } from "@/lib/map/buildingGeojson";

export default async function GET() {
    try {
        const buildings = await prisma.building.findMany({
            where: {
                footprint: {
                    not: undefined,
                },
            },
        });

        const geojson = buildingsToGeoJSON(buildings);

        return NextResponse.json(geojson);
    } catch (error) {
        console.error("GeoJSON API error:", error);

        return NextResponse.json(
            {error: "Failed to retrieve building geometry"},
            {status: 500}
        )
    }
}