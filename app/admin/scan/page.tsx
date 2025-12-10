import { QRScanner } from "@/components/qr-scanner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ScanPage() {
    return (
        <main className="min-h-screen flex flex-col p-4">
            <div className="mb-4">
                <Link href="/admin">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Button>
                </Link>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold">Ticket Verification</h1>
                    <p className="text-muted-foreground">Point camera at QR Code</p>
                </div>
                <QRScanner />
            </div>
        </main>
    );
}
