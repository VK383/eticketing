"use client";

// Poopoli 2026 Ticketing System - v2.0.0 - December 27, 2025
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatINR } from "@/lib/ticket-pricing";

interface TicketProps {
    id: string;
}

interface Ticket {
    id: string;
    user_name: string;
    user_phone: string;
    user_email: string | null;
    event_date: string;
    status: string;
    ticket_code: string;
    created_at: string;
    ticket_type?: string;
    amount?: number;
    payment_status?: string;
    payment_id?: string;
    attendee_count?: number;
}

export default function TicketView({ id }: TicketProps) {
    const searchParams = useSearchParams();
    const codeFromUrl = searchParams.get("code");
    const paymentStatus = searchParams.get("payment");
    
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const fetchTicket = async () => {
            const { data } = await supabase
                .from("tickets")
                .select("*")
                .eq("id", id)
                .single();
            
            if (data) {
                setTicket(data);
            }
            setLoading(false);
        };
        fetchTicket();
    }, [id]);

    const ticketCode = ticket?.ticket_code || codeFromUrl || "UNKNOWN";
    const eventDate = ticket?.event_date ? new Date(ticket.event_date).toLocaleDateString() : "Dec 20 - Jan 03, 2026";

    const handleDownload = () => {
        setDownloading(true);
        const canvas = canvasRef.current;

        if (canvas) {
            const link = document.createElement("a");
            link.download = `EventTicket-${ticketCode}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        }
        setDownloading(false);
    };

    useEffect(() => {
        if (loading && !ticketCode) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Create floral gradient for header - POOPOLI 2026 UPDATE
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "hsl(340, 85%, 55%)"); // Hibiscus red
        gradient.addColorStop(0.5, "hsl(45, 95%, 60%)"); // Marigold yellow
        gradient.addColorStop(1, "hsl(145, 55%, 45%)"); // Leaf green
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, 140);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 40px Inter, sans-serif";
        ctx.textAlign = "center";
        // POOPOLI 2026 - Flower Show (Version 2.0 - Dec 27, 2025)
        const eventTitle = "POOPOLI 2026";
        ctx.fillText(eventTitle, canvas.width / 2, 80);

        ctx.font = "20px Inter, sans-serif";
        ctx.fillText(eventDate, canvas.width / 2, 115);

        // Add floral decorative border elements
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        // Left flower accent
        ctx.beginPath();
        ctx.arc(30, 70, 15, 0, Math.PI * 2);
        ctx.stroke();
        // Right flower accent
        ctx.beginPath();
        ctx.arc(canvas.width - 30, 70, 15, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";

        ctx.font = "bold 24px Inter, sans-serif";
        ctx.fillText("Ticket Confirmed", canvas.width / 2, 200);

        ctx.font = "16px Inter, sans-serif";
        ctx.fillStyle = "#666666";
        ctx.fillText("Present this QR code at the entrance", canvas.width / 2, 230);

        // Add subtle floral watermark behind QR code
        setTimeout(() => {
            // Draw watermark flower
            ctx.globalAlpha = 0.05;
            ctx.fillStyle = "hsl(340, 85%, 55%)";
            const centerX = canvas.width / 2;
            const centerY = 360;
            // Simple flower petals
            for (let i = 0; i < 8; i++) {
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate((Math.PI * 2 * i) / 8);
                ctx.beginPath();
                ctx.ellipse(0, -40, 20, 35, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            // Flower center
            ctx.beginPath();
            ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
            ctx.fillStyle = "hsl(45, 95%, 60%)";
            ctx.fill();
            ctx.globalAlpha = 1.0;

            const qrCanvas = document.getElementById("qr-source") as HTMLCanvasElement;
            if (qrCanvas) {
                ctx.drawImage(qrCanvas, (canvas.width - 200) / 2, 260, 200, 200);

                ctx.fillStyle = "#000000";
                ctx.font = "bold 20px monospace";
                ctx.fillText(ticketCode, canvas.width / 2, 490);
                
                if (ticket?.user_name) {
                     ctx.font = "16px Inter, sans-serif";
                     ctx.fillText(ticket.user_name, canvas.width / 2, 520);
                }

                // Add attendee count if more than 1
                if (ticket?.attendee_count && ticket.attendee_count > 1) {
                    ctx.font = "bold 14px Inter, sans-serif";
                    ctx.fillStyle = "#666666";
                    ctx.fillText(`${ticket.attendee_count} People`, canvas.width / 2, 540);
                }
            }
        }, 200);

    }, [ticketCode, eventDate, loading, ticket]);

    if (loading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    }

    // Payment failed or pending
    if (ticket && ticket.payment_status !== 'success') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] w-full p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className={`text-center py-8 ${
                        paymentStatus === 'failed' ? 'bg-destructive/10' : 'bg-yellow-50'
                    }`}>
                        {paymentStatus === 'failed' ? (
                            <>
                                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
                                <CardTitle className="text-2xl text-destructive">Payment Failed</CardTitle>
                            </>
                        ) : (
                            <>
                                <Clock className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
                                <CardTitle className="text-2xl text-yellow-700">Payment Pending</CardTitle>
                            </>
                        )}
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="text-center space-y-2">
                            <p className="text-muted-foreground">
                                {paymentStatus === 'failed' 
                                    ? "Your payment could not be processed. Please try again."
                                    : "Your payment is being processed. Please wait..."}
                            </p>
                            <div className="pt-4 space-y-1 text-sm">
                                <p><strong>Name:</strong> {ticket.user_name}</p>
                                <p><strong>Ticket Type:</strong> {ticket.ticket_type?.toUpperCase()}</p>
                                <p><strong>Amount:</strong> {formatINR(ticket.amount || 0)}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button 
                            onClick={() => window.location.href = '/book'} 
                            className="w-full"
                        >
                            Try Again
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                            Contact support if payment was deducted
                        </p>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full p-4">
            <Card className="w-full max-w-md bg-white text-black overflow-hidden shadow-2xl">
                <CardHeader className="bg-primary text-primary-foreground text-center py-8">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-white" />
                    <CardTitle className="text-3xl">Booking Confirmed!</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center pt-8 space-y-6">
                    <div className="hidden">
                        <QRCodeCanvas id="qr-source" value={ticketCode} size={200} level={"H"} includeMargin={true} />
                    </div>

                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                        <canvas
                            ref={canvasRef}
                            width={400}
                            height={550}
                            className="w-full h-auto max-w-[300px]"
                        />
                    </div>

                    <p className="text-center text-sm text-muted-foreground px-4">
                        Your ticket code is <strong>{ticketCode}</strong>. <br />
                        Date: <strong>{eventDate}</strong>
                        {ticket?.attendee_count && ticket.attendee_count > 1 && (
                            <>
                                <br />
                                <span className="text-primary font-semibold">
                                    Group of {ticket.attendee_count} people
                                </span>
                            </>
                        )}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                    <Button onClick={handleDownload} disabled={downloading} className="w-full max-w-xs">
                        {downloading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Downloading...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Download Ticket
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
