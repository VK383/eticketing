"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { AlertCircle, CheckCircle, User, XCircle } from "lucide-react";
import { Loader2 } from "lucide-react";

export function QRScanner() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<"IDLE" | "VERIFYING" | "VALID" | "USED" | "INVALID">("IDLE");
    const [ticketDetails, setTicketDetails] = useState<any>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Initialize Scanner
        const timeout = setTimeout(() => {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
            );

            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;
        }, 100);

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, []);

    const onScanSuccess = (decodedText: string) => {
        if (verificationStatus === "VERIFYING") return;

        // Check if we are already showing a result for this code to prevent spam
        if (scanResult === decodedText && (verificationStatus === 'VALID' || verificationStatus === 'USED')) return;

        handleVerification(decodedText);
    };

    const onScanFailure = (error: any) => {
        // Handle scan failure
    };

    const handleVerification = async (code: string) => {
        setScanResult(code);
        setVerificationStatus("VERIFYING");

        try {
            const { data, error } = await supabase
                .from("tickets")
                .select("*")
                .eq("ticket_code", code)
                .single();

            if (error || !data) {
                setVerificationStatus("INVALID");
                return;
            }

            setTicketDetails(data);

            if (data.status === "used") {
                setVerificationStatus("USED");
            } else {
                // Mark as used
                const { error: updateError } = await supabase
                    .from("tickets")
                    .update({ status: "used" })
                    .eq("id", data.id);

                if (updateError) throw updateError;
                setVerificationStatus("VALID");
            }

        } catch (err) {
            console.error(err);
            setVerificationStatus("INVALID");
        }
    };

    const reset = () => {
        setScanResult(null);
        setVerificationStatus("IDLE");
        setTicketDetails(null);
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Scan Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                    <div id="reader" className="w-full overflow-hidden rounded-lg bg-black text-white"></div>
                </CardContent>
            </Card>

            {verificationStatus !== "IDLE" && (
                <Card className={`border-2 ${verificationStatus === 'VALID' ? 'border-green-500 bg-green-500/10' :
                        verificationStatus === 'USED' ? 'border-orange-500 bg-orange-500/10' :
                            verificationStatus === 'VERIFYING' ? 'border-blue-500' :
                                'border-red-500 bg-red-500/10'
                    }`}>
                    <CardContent className="pt-6 text-center space-y-4">
                        {verificationStatus === "VERIFYING" && <Loader2 className="w-12 h-12 mx-auto animate-spin" />}

                        {verificationStatus === "VALID" && (
                            <>
                                <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
                                <h2 className="text-2xl font-bold text-green-700">Valid Ticket</h2>
                                <div className="text-left bg-white/50 p-4 rounded-lg text-black">
                                    <p className="flex items-center gap-2"><User className="w-4 h-4" /> <strong>{ticketDetails?.user_name}</strong></p>
                                    <p className="text-sm text-gray-600">Date: {new Date(ticketDetails?.event_date).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600">Code: {scanResult}</p>
                                </div>
                            </>
                        )}

                        {verificationStatus === "USED" && (
                            <>
                                <AlertCircle className="w-16 h-16 mx-auto text-orange-600" />
                                <h2 className="text-2xl font-bold text-orange-700">Already Used</h2>
                                <div className="text-left bg-white/50 p-4 rounded-lg text-black">
                                    <p className="flex items-center gap-2"><User className="w-4 h-4" /> <strong>{ticketDetails?.user_name}</strong></p>
                                    <p className="text-sm text-gray-600">Date: {new Date(ticketDetails?.event_date).toLocaleDateString()}</p>
                                </div>
                            </>
                        )}

                        {verificationStatus === "INVALID" && (
                            <>
                                <XCircle className="w-16 h-16 mx-auto text-red-600" />
                                <h2 className="text-2xl font-bold text-red-700">Invalid Ticket</h2>
                                <p>This code does not exist in the database.</p>
                            </>
                        )}

                        <Button onClick={reset} size="lg" className="w-full">Scan Next</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
