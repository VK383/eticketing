import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10" />

            <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                <div className="space-y-2">
                    <span className="inline-flex items-center rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        <Ticket className="mr-2 h-4 w-4" /> 5000+ Tickets Available Daily
                    </span>
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 pb-2">
                        MEGA EVENT <br /> 2025
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        The biggest gathering of the year. 20 days of non-stop entertainment, networking, and innovation.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>Dec 20 - Jan 10, 2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>Grand Arena, City Center</span>
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
