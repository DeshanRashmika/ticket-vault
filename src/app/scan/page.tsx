"use client";

import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { verifyAndCheckInTicket } from "@/actions/check-in";

export default function ScanTicketPage() {
  const [manualPayload, setManualPayload] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    ticket?: {
      id: string;
      event: { title: string };
      user: { email: string };
    };
  } | null>(null);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      async (decodedText) => {
        await handleVerification(decodedText);
      },
      (errorMessage) => {
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => console.error(error));
      }
    };
  }, []);

  async function handleVerification(payload: string) {
    setLoading(true);
    setResult(null);

    try {
      const res = await verifyAndCheckInTicket(payload);

      if (res.success && res.ticket) {
        setResult({
          success: true,
          message: "Check-in Successful! Ticket Validated.",
          ticket: res.ticket,
        });
      } else {
        setResult({
          success: false,
          message: res.error || "Invalid signature or ticket already scanned.",
        });
      }
    } catch (err) {
      setResult({
        success: false,
        message: "Verification failed. System error occurred.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (manualPayload.trim()) {
      handleVerification(manualPayload.trim());
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
        <h1 className="text-2xl font-bold mb-6 text-center">Scan & Verify Ticket</h1>

        {/* Camera Scanner Box */}
        <div id="qr-reader" className="w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 mb-6"></div>

        {/* Manual Input Fallback */}
        <form onSubmit={handleManualSubmit} className="space-y-3 mb-6">
          <label className="block text-xs uppercase tracking-wider text-slate-400">
            Or Enter Payload Manually
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualPayload}
              onChange={(e) => setManualPayload(e.target.value)}
              placeholder="ticketId.hashSignature"
              className="flex-1 p-2.5 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500 text-sm font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded font-semibold transition text-sm disabled:opacity-50"
            >
              Verify
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="p-4 bg-slate-700/50 rounded-xl text-center animate-pulse text-sm text-blue-300 border border-blue-500/30">
            Verifying Cryptographic Signature & DB State...
          </div>
        )}

        {/* Verification Result Display */}
        {result && (
          <div
            className={`p-5 rounded-xl border ${
              result.success
                ? "bg-green-950/60 border-green-500 text-green-300"
                : "bg-red-950/60 border-red-500 text-red-300"
            }`}
          >
            <div className="font-bold text-lg mb-1">
              {result.success ? "✓ VALID TICKET (CHECKED IN)" : "✕ REJECTED / INVALID"}
            </div>
            <p className="text-sm mb-2">{result.message}</p>

            {result.ticket && (
              <div className="mt-3 text-xs bg-slate-900/80 p-3 rounded border border-slate-700 text-slate-300 space-y-1 font-mono">
                <p><strong>Event:</strong> {result.ticket.event?.title}</p>
                <p><strong>Attendee:</strong> {result.ticket.user?.email}</p>
                <p><strong>Ticket ID:</strong> {result.ticket.id}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}