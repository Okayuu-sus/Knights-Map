import Image from "next/image";
import Link from "next/link";
import { signIn } from "@/lib/auth";

export default function loginCard() {
    return (
        <div className="w-full max-w-md rounded-2xl border
                        border-neutral-800 bg-neutral-900
                        p-10 text-center shadow-2xl">

            {/* Logo */}
            <div className="mx-auto mb-5 flex h-14 w-14
                            items-center justify-center
                            rounded-2xl bg-[#FFC904]">

                <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="1.8"
                >
                    <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.7" />
                </svg>

            </div>

            {/* Website name */}
            <h1 className="text-3xl font-bold tracking-tight">
                KNIGHTS<span className="text-[#FFC904]">MAP</span>
            </h1>

            <p className="mt-2 text-xs tracking-widest
                          text-neutral-500">
                EXPLORE · CONNECT · DISCOVER
            </p>

            {/* Welcome message */}
            <h2 className="mt-10 text-2xl font-semibold">
                Welcome to campus.
            </h2>

            <p className="mt-3 text-sm leading-relaxed
                          text-neutral-400">
                Navigate UCF, discover campus events,
                and make the most of your day.
            </p>       

            <form action={async () => {
                "use server";

                await signIn("google", {
                    redirectTo: "/dashboard",
                })
            }}>
                <button
                    type="submit"
                    className="mt-8 flex w-full cursor-pointer
                               items-center justify-center gap-3
                               rounded-lg bg-white px-5 py-4
                               font-medium text-black
                               transition hover:bg-neutral-200"
                >
                    <Image
                        src="/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                    />

                    Continue with Google
                </button>
            </form>
            
            <Link
                href="/"
                className="mt-6 inline-block text-sm
                           text-neutral-400 transition
                           hover:text-[#FFC904]"
            >
                Explore campus as a guest →
            </Link>

            {/* Footer */}
            <div className="mt-8 border-t border-neutral-800 pt-5">
                <p className="text-xs text-neutral-500">
                    An independent project built for UCF students.
                </p>
            </div>
        </div>
    );
}
