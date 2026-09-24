"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { issueTicket } from "@/actions/event";
import { QRCodeSVG } from "qrcode.react";

function IssueTicketForm() {
  const searchParams = useSearchParams();

  const urlEventId = searchParams.get("eventId") || "";
  const urlUserId = searchParams.get("userId") || "";

  const [formData, setFormData] = useState({
    eventId: urlEventId,
    userId: urlUserId,
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [issuedTicket, setIssuedTicket] = useState<{
    id: string;
    qrCodePayload: string | null;
    price: number;
    event: { title: string };
    user: { email: string };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const downloadQRCode = () => {
    const svgElement = document.getElementById("ticket-qr-svg") as SVGElement | null;
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;

      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
      }

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `Ticket-QR-${issuedTicket?.id || "vault"}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIssuedTicket(null);

    try {
      const res = await issueTicket({
        eventId: formData.eventId,
        userId: formData.userId,
        price: parseFloat(formData.price),
      });

      if (res.success && res.ticket) {
        setIssuedTicket(res.ticket);
      } else {
        setError("Failed to issue ticket. Verify Event ID and User ID.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
      <h1 className="text-2xl font-bold mb-6 text-center">Issue Ticket & Signed QR</h1>

      {error && (
        <div className="p-3 rounded mb-4 text-center font-medium bg-red-800/50 text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Event ID</label>
          <input
            type="text"
            required
            value={formData.eventId}
            onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
            className="w-full p-2.5 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500 font-mono text-sm"
            placeholder="Auto-filled or paste Event ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">User ID (Attendee)</label>
          <input
            type="text"
            required
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            className="w-full p-2.5 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500 font-mono text-sm"
            placeholder="Auto-filled or paste User ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (LKR)</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full p-2.5 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
            placeholder="e.g. 2500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 hover:bg-green-500 rounded font-semibold transition disabled:opacity-50"
        >
          {loading ? "Generating Signed Ticket..." : "Issue Ticket"}
        </button>
      </form>

      {/* Issued Ticket Details & QR Render */}
      {issuedTicket && issuedTicket.qrCodePayload && (
        <div className="mt-8 p-6 bg-slate-900 border border-green-500/30 rounded-xl flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-widest text-green-400 font-semibold mb-2">
            ✓ Ticket Successfully Issued
          </span>
          <h2 className="text-xl font-bold">{issuedTicket.event.title}</h2>
          <p className="text-sm text-slate-400 mb-4">{issuedTicket.user.email}</p>

          <div className="p-4 bg-white rounded-xl mb-4">
            <QRCodeSVG id="ticket-qr-svg" value={issuedTicket.qrCodePayload} size={180} />
          </div>

          <button
            onClick={downloadQRCode}
            className="mb-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition flex items-center gap-2 shadow-lg"
          >
             Download QR Code (PNG)
          </button>

          <p className="text-xs font-mono text-slate-400 break-all bg-slate-800 p-2 rounded w-full">
            Payload: {issuedTicket.qrCodePayload}
          </p>
        </div>
      )}
    </div>
  );
}

export default function IssueTicketPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center">
      <Suspense fallback={<div className="text-slate-400">Loading form...</div>}>
        <IssueTicketForm />
      </Suspense>
    </main>
  );
}