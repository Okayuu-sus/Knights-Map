import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginCard from "@/components/LoginCard";


export const metadata: Metadata = {
    title: "Login | Knights Map",
    description: "Sign in to explore the UCF campus.",
};

export default async function LoginPage() {
    const session = await auth();

    if (session?.user) {
        redirect("/dashboard");
    }

    return (
        <main className="relative flex min-h-screen
                         items-center justify-center
                         overflow-hidden bg-[#101113]
                         px-6 text-white">

            {/* Background pattern */}
            <div
                className="pointer-events-none absolute
                           inset-0 opacity-10"
                style={{
                    backgroundImage:
                        "linear-gradient(#777 1px, transparent 1px), " +
                        "linear-gradient(90deg, #777 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    maskImage:
                        "radial-gradient(ellipse, black, transparent 80%)",
                }}
            />

            {/* Login interface */}
            <div className="relative z-10">
                <LoginCard />
            </div>

        </main>
    )
}
