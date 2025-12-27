import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Poopoli 2026 - Flower Show Tickets",
    description: "Book tickets for Poopoli 2026 Flower Show at Ambalavayal, Wayanad | January 1-15, 2026",
    generator: "Next.js",
    applicationName: "Poopoli 2026 Ticketing",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={cn(inter.className, "min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-white")}>
                {children}
            </body>
        </html>
    );
}
