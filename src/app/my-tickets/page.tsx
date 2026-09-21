"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

type Ticket = {
  id: string;
  status: string;
  price: number;
  qrCodePayload: string | null;
  createdAt: string;
  event: {
    id: string;
    title: string;
    location: string;
    date: string;
  };
};

function MyTicketsForm() {
  const searchParams = useSearchParams();
  const initialUser = searchParams.get("userId") || searchParams.get("email") || "";

  const [searchQuery, setSearchQuery] = useState(initialUser);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/user-tickets?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }

  const downloadQRCode = (ticketId: string, eventTitle: string) => {
    const svgElement = document.getElementById(`qr-svg-${ticketId}`) as SVGElement | null;
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
      downloadLink.download = `Ticket-${eventTitle.replace(/\s+/g, "_")}-${ticketId.slice(0, 6)}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const activeTickets = tickets.filter((t) => t.status === "ISSUED" || t.status === "PENDING");
  const pastTickets = tickets.filter((t) => t.status === "CHECKED_IN" || t.status === "CANCELLED");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-extrabold text-white"> My Ticket Wallet</h1>
        <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
          Enter your registered Email or User ID to access your cryptographically signed event passes.
        </p>

        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input
            type="text"
            required
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Email or User ID (e.g. attendee@vault.com)"
            className="flex-1 p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition text-sm shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Find Tickets"}
          </button>
        </form>
      </div>

      {/* Tickets List */}
      {searched && (
        <div className="space-y-8">
          {tickets.length === 0 ? (
            <div className="p-12 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-center">
              <p className="text-slate-400 text-base">No tickets found for {searchQuery}.</p>
              <p className="text-xs text-slate-500 mt-1">Make sure you entered the correct User ID or Email.</p>
            </div>
          ) : (
            <>
              {/* Active Tickets Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  Active Event Passes ({activeTickets.length})
                </h2>

                {activeTickets.length === 0 ? (
                  <p className="text-sm text-slate-500 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                    No active tickets available for upcoming events.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/60 transition shadow-lg relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl border-l border-b border-emerald-500/30">
                          VALID PASS
                        </div>

                        <div>
                          <p className="text-xs font-mono text-slate-400">
                            📅 {new Date(ticket.event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                          <h3 className="text-xl font-bold text-white mt-2">{ticket.event.title}</h3>
                          <p className="text-xs text-slate-400 mt-1">📍 {ticket.event.location}</p>
                          <p className="text-xs font-mono text-slate-500 mt-2">Pass ID: {ticket.id}</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-sm font-bold text-emerald-400">LKR {ticket.price.toLocaleString()}</span>
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition flex items-center gap-1.5 shadow-md"
                          >
                            <span>🔍</span> View QR Code
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past / Used Tickets Section */}
              {pastTickets.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-slate-800">
                  <h2 className="text-xl font-bold text-slate-400 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-600" />
                    Used / Expired Passes ({pastTickets.length})
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pastTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between opacity-75 hover:opacity-100 transition"
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-mono text-slate-500">
                              {new Date(ticket.event.date).toLocaleDateString()}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                ticket.status === "CHECKED_IN"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                  : "bg-red-500/10 text-red-400 border-red-500/20"
                              }`}
                            >
                              {ticket.status === "CHECKED_IN" ? "USED AT GATE" : "CANCELLED"}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-300 mt-2">{ticket.event.title}</h3>
                          <p className="text-xs text-slate-500 mt-1">📍 {ticket.event.location}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-500">
                          <span>Pass ID: {ticket.id.slice(0, 8)}...</span>
                          <span className="font-mono">LKR {ticket.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* QR Code Modal Display */}
      {selectedTicket && selectedTicket.qrCodePayload && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 relative shadow-2xl">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
            >
              ✕
            </button>

            <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full">
              Verified Entry Pass
            </span>

            <h3 className="text-xl font-bold text-white">{selectedTicket.event.title}</h3>
            <p className="text-xs text-slate-400">📍 {selectedTicket.event.location}</p>

            <div className="p-4 bg-white rounded-xl inline-block shadow-inner my-2">
              <QRCodeSVG
                id={`qr-svg-${selectedTicket.id}`}
                value={selectedTicket.qrCodePayload}
                size={200}
              />
            </div>

            <p className="text-[11px] font-mono text-slate-400 bg-slate-800 p-2 rounded border border-slate-700 break-all">
              {selectedTicket.qrCodePayload}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => downloadQRCode(selectedTicket.id, selectedTicket.event.title)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition shadow-lg"
              >
                📥 Download PNG
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyTicketsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      <Suspense fallback={<div className="text-center text-slate-400 py-12">Loading Wallet...</div>}>
        <MyTicketsForm />
      </Suspense>
    </main>
  );
}