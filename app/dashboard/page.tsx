import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function dashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <main className="flex min-h-screen flex-col
                         items-center justify-center
                         bg-neutral-950 text-white">

            <h1 className="text-3xl font-bold">
                Welcome, {session.user.name}
            </h1>

            <p className="mt-3 text-neutral-400">
                {session.user.email}
            </p>

            <Link
                href="/"
                className="mt-8 rounded-lg bg-[#FFC904]
                           px-6 py-3 font-medium text-black"
            >
                Explore Campus
            </Link>

            <form
                action={async () => {
                    "use server";

                    await signOut({
                        redirectTo: "/login",
                    });
                }}
            >
                <button
                    type="submit"
                    className="mt-5 cursor-pointer
                               text-neutral-400 hover:text-white"
                >
                    Sign out
                </button>
            </form>

        </main>
    )
}