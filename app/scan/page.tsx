import { QRScanner } from "@/components/qr-scanner";

export default function PublicScanPage() {
    return (
        <main className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Ticket Verification</h1>
                    <p className="text-muted-foreground text-lg">Point camera at QR Code to verify ticket</p>
                </div>
                <QRScanner />
            </div>
        </main>
    );
}
