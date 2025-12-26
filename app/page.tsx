import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Flowers } from "@/components/decorative/flowers";
import { Bees } from "@/components/decorative/bees";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Animated floral decorations */}
            <Flowers />
            <Bees />

            <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                <div className="space-y-2">
                    <span className="inline-flex items-center rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        <Ticket className="mr-2 h-4 w-4" /> 1,00,000+ Tickets Available Daily
                    </span>
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary pb-2">
                        POOPOLI <br /> 2026
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Kerala&apos;s Premier Flower Show. 15 days of breathtaking floral exhibits, gardens, and cultural celebrations.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>January 1-15, 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>Ambalavayal, Wayanad</span>
                    </div>
                </div>

                <div className="pt-8">
                    <Link href="/book">
                        <Button size="lg" className="h-16 px-10 text-xl rounded-full shadow-[0_0_40px_-10px_var(--primary)] hover:shadow-[0_0_60px_-15px_var(--primary)] transition-shadow duration-300">
                            Book Your Ticket
                        </Button>
                    </Link>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Instant QR Code Ticket • Zero Booking Fees
                    </p>
                </div>
            </div>
        </main>
    );
}
