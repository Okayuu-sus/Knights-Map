import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const buildings = await prisma.building.findMany({
            orderBy: {
                name: "asc"
            }
        })

        return NextResponse.json(buildings);
    } catch (error) {
        console.log("Failed To Fetch Buildings: ", error)

        return NextResponse.json(
            { error: "Failed To Fetch Buildings"},
            { status: 500},
        )
    }
}