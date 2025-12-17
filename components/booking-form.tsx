"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { TICKET_TYPES, formatINR, type TicketType } from "@/lib/ticket-pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Check } from "lucide-react";

export function BookingForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        date: "",
        ticketType: "regular" as TicketType,
    });
    const [error, setError] = useState<string | null>(null);

    // Generate a unique ticket code
    const generateTicketCode = (date: string) => {
        const dateStr = date.replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TKT-${dateStr}-${randomStr}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Check if Supabase is configured
            if (!isSupabaseConfigured) {
                throw new Error("Database not configured. Please check environment variables.");
            }

            if (!formData.date) {
                throw new Error("Please select a date.");
            }

            // Validate date is not in the past
            const selectedDateObj = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDateObj < today) {
                throw new Error("Please select a future date.");
            }

            // Generate ticket code
            const ticketCode = generateTicketCode(formData.date);
            const ticketPrice = TICKET_TYPES[formData.ticketType].price;

            // Insert ticket with pending payment status
            const { data, error: dbError } = await supabase
                .from("tickets")
                .insert([
                    {
                        user_name: formData.name,
                        user_phone: formData.phone,
                        user_email: formData.email || null,
                        event_date: formData.date,
                        ticket_code: ticketCode,
                        ticket_type: formData.ticketType,
                        amount: ticketPrice,
                        status: "pending",
                        payment_status: "pending",
                    },
                ])
                .select()
                .single();

            if (dbError) {
                console.log('Supabase error details:', {
                    message: dbError.message,
                    details: dbError.details,
                    hint: dbError.hint,
                    code: dbError.code
                });
                throw new Error(dbError.message || 'Database error occurred');
            }

            if (!data) {
                throw new Error('Ticket was not created. Please try again.');
            }

            // Initiate PhonePe payment
            const paymentResponse = await fetch('/api/payment/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticketId: data.id,
                    amount: ticketPrice,
                    phone: formData.phone
                })
            });

            const paymentResult = await paymentResponse.json();

            if (paymentResult.success && paymentResult.paymentUrl) {
                // Redirect to PhonePe payment page
                window.location.href = paymentResult.paymentUrl;
            } else {
                throw new Error(paymentResult.message || 'Failed to initiate payment');
            }
        } catch (err: unknown) {
            let errorMessage = "Failed to book ticket. Please try again.";
            
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'object' && err !== null) {
                const errObj = err as { message?: string; details?: string; hint?: string };
                errorMessage = errObj.message || errObj.details || errObj.hint || errorMessage;
            }
            
            console.log('Booking error:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto border-0 sm:border bg-background/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Book Your Ticket</CardTitle>
                <CardDescription>Select your ticket type and complete payment to secure your spot.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    {/* Ticket Type Selection */}
                    <div className="space-y-3">
                        <Label>Select Ticket Type</Label>
                        <div className="grid gap-3 md:grid-cols-3">
                            {(Object.keys(TICKET_TYPES) as TicketType[]).map((type) => {
                                const ticket = TICKET_TYPES[type];
                                const isSelected = formData.ticketType === type;
                                return (
                                    <div
                                        key={type}
                                        onClick={() => setFormData({ ...formData, ticketType: type })}
                                        className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                            isSelected
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute right-2 top-2">
                                                <Check className="h-5 w-5 text-primary" />
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold">{ticket.name}</h3>
                                            <p className="text-2xl font-bold text-primary">
                                                {formatINR(ticket.price)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{ticket.description}</p>
                                            <ul className="space-y-1 text-xs text-muted-foreground">
                                                {ticket.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-1">
                                                        <span className="mt-0.5">•</span>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Select Event Date</Label>
                        <Input
                            id="date"
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                            className="w-full"
                        />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
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

                    {error && (
                        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex-col space-y-2">
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Pay {formatINR(TICKET_TYPES[formData.ticketType].price)} & Book
                            </>
                        )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        Secure payment via PhonePe • UPI, Cards, Wallets accepted
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
