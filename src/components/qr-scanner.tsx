"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { checkInTicket } from "@/actions/check-in";

type ScanResult = Awaited<ReturnType<typeof checkInTicket>> | null;

export default function QrScanner() {
    const [scanResult, setScanResult] = useState<ScanResult>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            },
            false
        );

        scannerRef.current = scanner;

        async function onScanSuccess(decodedText: string) {
            if (isProcessing) return;
            setIsProcessing(true);

            try {
                const res = await checkInTicket(decodedText);
                setScanResult(res);
            } catch (err) {
                console.error("Scan error:", err);
                setScanResult({
                    success: false,
                    error: "INTERNAL_SERVER_ERROR",
                });
            } finally {
                setIsProcessing(false);
            }
        }

        scanner.render(onScanSuccess, () => {
        });

        return () => {
            scanner.clear().catch((error) => console.error("Failed to clear scanner", error));
        };
    }, [isProcessing]);

    return (
        <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Gatekeeper QR Verification</h1>

            <div id="reader" className="w-full rounded-lg overflow-hidden border"></div>

            {isProcessing && <p className="mt-4 text-blue-600 font-semibold">Verifying Ticket...</p>}

            {scanResult && !isProcessing && (
                <div
                    className={`mt-4 p-4 rounded-md text-center w-full ${scanResult.success
                            ? "bg-green-100 border border-green-400 text-green-800"
                            : "bg-red-100 border border-red-400 text-red-800"
                        }`}
                >
                    {scanResult.success ? (
                        <div>
                            <p className="font-bold text-lg">ACCESS GRANTED</p>
                            <p className="text-sm">Event: {scanResult.event?.title}</p>
                            <p className="text-sm">
                                Attendee: {scanResult.attendee?.name || scanResult.attendee?.email}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-bold text-lg">ACCESS DENIED</p>
                            <p className="text-sm font-medium">Reason: {scanResult.error}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}