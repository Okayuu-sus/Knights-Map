import React, {Suspense} from 'react'
import CampusMap from "@/components/map/CampusMap";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function Home () {

    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

  return (
    <Suspense fallback={<div>Loading Knights Map...</div>}>
      <main className="relative h-screen w-screen overflow-hidden">
        <CampusMap />

        <div className="absolute left-5 top-5 z-10 rounded-xl bg-white p-4 shadow-lg">
          <h1 className="text-2xl font-bold text-black">
            Knights Map
          </h1>

          <p className="text-sm text-gray-600">
            Explore the University of Central Florida
          </p>
        </div>
      </main>
    </Suspense>
  )
}
