import { BookingForm } from "@/components/booking-form";

export default function BookPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

            <div className="z-10 w-full">
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Registration</h1>
                    <p className="text-muted-foreground">Limited seats available for today.</p>
                </div>
                <BookingForm />
            </div>
        </main>
    );
}
