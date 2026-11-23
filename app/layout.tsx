import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Knights Map",
    description: 
        "An interactive 3D campus map for University of Central Florida students.",
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;  
}>) {
    return (
        <html lang="en">
            <body className="m-0 min-h-screen">
                {children}
            </body>
        </html>
    )
}
