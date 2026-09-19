import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function LandingPage() {
  const [eventCount, ticketCount] = await Promise.all([
    prisma.event.count(),
    prisma.ticket.count(),
  ]);

  return (
    <main className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-4xl text-center space-y-6 relative z-10 py-12">
        {/* Security Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-blue-400 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          HMAC-SHA256 Cryptographic Anti-Tampering Standard
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
          Enterprise Event Ticketing & <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Atomic QR Verification Gateway
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-normal">
          Zero race conditions, real-time WebRTC browser camera scanning, and cryptographically signed tickets designed for high-throughput gate operations.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <Link
            href="/events"
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-lg shadow-blue-600/25 flex items-center gap-2"
          >
            Explore Events Catalog →
          </Link>

          <Link
            href="/scan"
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition flex items-center gap-2"
          >
            📷 Open Gate Scanner
          </Link>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-12 max-w-2xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">{eventCount}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Active Events</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">{ticketCount}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Tickets Issued</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm col-span-2 sm:col-span-1">
            <div className="text-2xl font-bold text-emerald-400">100%</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Atomic Security</div>
          </div>
        </div>
      </div>
    </main>
  );
}