"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface EventDate {
    id: string;
    event_date: string;
    capacity: number;
    booked_count: number;
}

export function BookingForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dates, setDates] = useState<EventDate[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        date: "",
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDates = async () => {
            const { data, error } = await supabase
                .from("event_dates")
                .select("*")
                .order("event_date", { ascending: true });
            
            if (data) {
                setDates(data);
                // Select first available date by default
                const firstAvailable = data.find(d => d.booked_count < d.capacity);
                if (firstAvailable) {
                    setFormData(prev => ({ ...prev, date: firstAvailable.event_date }));
                }
            }
        };
        fetchDates();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.date) {
                throw new Error("Please select a date.");
            }

            const { data, error: dbError } = await supabase.rpc("book_ticket", {
                p_user_name: formData.name,
                p_user_phone: formData.phone,
                p_user_email: formData.email,
                p_event_date: formData.date,
            });

            if (dbError) throw dbError;

            // 3. Redirect to Ticket Page
            if (data) {
                router.push(`/ticket/${data.id}?code=${data.ticket_code}`);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to book ticket. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto border-0 sm:border bg-background/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Secure Your Spot</CardTitle>
                <CardDescription>Enter your details to generate your ticket immediately.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Select Date</Label>
                        <select
                            id="date"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select a date</option>
                            {dates.map((date) => (
                                <option 
                                    key={date.id} 
                                    value={date.event_date}
                                    disabled={date.booked_count >= date.capacity}
                                >
                                    {new Date(date.event_date).toLocaleDateString()} 
                                    {date.booked_count >= date.capacity ? " (Sold Out)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address (Optional)</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Get My Ticket"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
