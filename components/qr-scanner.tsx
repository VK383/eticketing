"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { AlertCircle, CheckCircle, User, XCircle } from "lucide-react";
import { Loader2 } from "lucide-react";

interface Ticket {
    id: string;
    user_name: string;
    user_phone: string;
    user_email: string | null;
    event_date: string;
    status: string;
    ticket_code: string;
    created_at: string;
    attendee_count?: number;
    scan_count?: number;
    first_scanned_at?: string | null;
    last_scanned_at?: string | null;
}

export function QRScanner() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<"IDLE" | "VERIFYING" | "VALID" | "USED" | "INVALID">("IDLE");
    const [ticketDetails, setTicketDetails] = useState<Ticket | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [scanningPaused, setScanningPaused] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const isProcessingRef = useRef(false);

    // Success beep sound
    const playBeep = (isSuccess: boolean) => {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = isSuccess ? 800 : 400;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    };

    useEffect(() => {
        // Initialize Scanner
        void setTimeout(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onScanSuccess = (decodedText: string) => {
        // Use ref for immediate synchronous check (prevents race condition)
        if (isProcessingRef.current) return;

        // Check if we are already showing a result for this code to prevent spam
        if (scanResult === decodedText && (verificationStatus === 'VALID' || verificationStatus === 'USED' || verificationStatus === 'INVALID')) return;

        // Block scanning immediately (synchronous)
        isProcessingRef.current = true;
        setScanningPaused(true);
        
        // Actually pause the scanner
        if (scannerRef.current) {
            scannerRef.current.pause(true);
        }
        
        handleVerification(decodedText);
    };

    const onScanFailure = () => {
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
                playBeep(false);
                return;
            }

            setTicketDetails(data);

            // Check if this is first scan or subsequent scan
            const isFirstScan = !data.first_scanned_at || data.scan_count === 0;

            if (isFirstScan) {
                // First scan - mark as used and show confirmation
                const { error: updateError } = await supabase
                    .from("tickets")
                    .update({ 
                        status: "used",
                        scan_count: 1,
                        first_scanned_at: new Date().toISOString(),
                        last_scanned_at: new Date().toISOString()
                    })
                    .eq("id", data.id);

                if (updateError) throw updateError;
                
                setTicketDetails({ ...data, scan_count: 1, first_scanned_at: new Date().toISOString() });
                setVerificationStatus("VALID");
                setShowConfirmation(true);
                playBeep(true);
            } else {
                // Already scanned - increment scan count
                const newScanCount = (data.scan_count || 1) + 1;
                const { error: updateError } = await supabase
                    .from("tickets")
                    .update({ 
                        scan_count: newScanCount,
                        last_scanned_at: new Date().toISOString()
                    })
                    .eq("id", data.id);

                if (updateError) throw updateError;
                
                setTicketDetails({ ...data, scan_count: newScanCount });
                setVerificationStatus("USED");
                playBeep(false);
            }

        } catch (err) {
            console.error(err);
            setVerificationStatus("INVALID");
            playBeep(false);
        }
    };

    const reset = () => {
        setScanResult(null);
        setVerificationStatus("IDLE");
        setTicketDetails(null);
        setShowConfirmation(false);
        setScanningPaused(false);
        isProcessingRef.current = false; // Reset processing flag
        
        // Actually resume the scanner
        if (scannerRef.current) {
            scannerRef.current.resume();
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative">
            {/* Dialog positioned above scanner with absolute positioning and overlay */}
            {verificationStatus !== "IDLE" && (
                <div className="absolute top-0 left-0 right-0 z-50 mb-4">
                    <Card className={`border-2 shadow-2xl bg-white ${verificationStatus === 'VALID' ? 'border-green-500' :
                            verificationStatus === 'USED' ? 'border-orange-500' :
                                verificationStatus === 'VERIFYING' ? 'border-blue-500' :
                                    'border-red-500'
                        }`}>
                        <CardContent className="pt-6 text-center space-y-4">{verificationStatus === "VERIFYING" && <Loader2 className="w-12 h-12 mx-auto animate-spin" />}

                            {verificationStatus === "VALID" && (
                                <>
                                    <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
                                    <h2 className="text-2xl font-bold text-green-700">✅ Scanning Successful!</h2>
                                    <div className="text-left bg-green-50 p-4 rounded-lg border border-green-200 space-y-2">
                                        <p className="flex items-center gap-2"><User className="w-4 h-4" /> <strong>{ticketDetails?.user_name}</strong></p>
                                        <p className="text-sm text-gray-600">Date: {ticketDetails?.event_date ? new Date(ticketDetails.event_date).toLocaleDateString() : 'N/A'}</p>
                                        <p className="text-sm text-gray-600">Code: {scanResult}</p>
                                        {ticketDetails?.attendee_count && ticketDetails.attendee_count > 1 && (
                                            <p className="text-lg font-bold text-primary mt-2">
                                                🎫 Group of {ticketDetails.attendee_count} people
                                            </p>
                                        )}
                                    </div>
                                    
                                    {showConfirmation && ticketDetails?.attendee_count && ticketDetails.attendee_count > 1 && (
                                        <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-lg">
                                            <p className="font-semibold text-yellow-800">
                                                ⚠️ Have all {ticketDetails.attendee_count} people entered?
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {verificationStatus === "USED" && (
                                <>
                                    <AlertCircle className="w-16 h-16 mx-auto text-orange-600" />
                                    <h2 className="text-2xl font-bold text-orange-700">⚠️ Already Used</h2>
                                <div className="text-left bg-orange-50 p-4 rounded-lg border border-orange-200 space-y-2">
                                    <p className="flex items-center gap-2"><User className="w-4 h-4 text-black" /> <strong className="text-black">{ticketDetails?.user_name}</strong></p>
                                        <p className="text-sm text-gray-600">Date: {ticketDetails?.event_date ? new Date(ticketDetails.event_date).toLocaleDateString() : 'N/A'}</p>
                                        <p className="text-sm text-gray-600">Code: {scanResult}</p>
                                        {ticketDetails?.attendee_count && ticketDetails.attendee_count > 1 && (
                                            <p className="text-sm text-gray-600">
                                                Group: {ticketDetails.attendee_count} people
                                            </p>
                                        )}
                                        <div className="mt-3 pt-3 border-t border-orange-300">
                                            <p className="text-orange-700 font-bold">
                                                Scanned {ticketDetails?.scan_count || 0} times
                                            </p>
                                            <p className="text-xs text-orange-600">
                                                Already scanned {((ticketDetails?.scan_count || 1) - 1)} time(s) after first entry
                                            </p>
                                        </div>
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
                </div>
            )}

            {/* Scanner Card - positioned below dialog */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Scan Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                    <div id="reader" className={`w-full overflow-hidden rounded-lg bg-black text-white transition-opacity ${scanningPaused ? 'opacity-50' : ''}`}></div>
                    {scanningPaused && (
                        <p className="text-center text-sm text-muted-foreground mt-2">
                            📷 Scanner paused - Review result above
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
