"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TicketProps {
    id: string;
}

export default function TicketView({ id }: TicketProps) {
    const searchParams = useSearchParams();
    const codeFromUrl = searchParams.get("code");
    
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const fetchTicket = async () => {
            const { data, error } = await supabase
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

        ctx.fillStyle = "#7c3aed";
        ctx.fillRect(0, 0, canvas.width, 140);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 40px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("MEGA EVENT 2025", canvas.width / 2, 80);

        ctx.font = "20px Inter, sans-serif";
        ctx.fillText(eventDate, canvas.width / 2, 115);

        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";

        ctx.font = "bold 24px Inter, sans-serif";
        ctx.fillText("Ticket Confirmed", canvas.width / 2, 200);

        ctx.font = "16px Inter, sans-serif";
        ctx.fillStyle = "#666666";
        ctx.fillText("Present this QR code at the entrance", canvas.width / 2, 230);

        setTimeout(() => {
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
            }
        }, 200);

    }, [ticketCode, eventDate, loading, ticket]);

    if (loading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
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
