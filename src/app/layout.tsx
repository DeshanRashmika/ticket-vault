import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ticket Vault | Secure Cryptographic Event Gateway",
  description: "Enterprise-grade Event Ticketing & Atomic QR Verification Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col`}
      >
        {/* Glassmorphism Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <span className="p-2 bg-gradient-to-tr rounded-lg text-white text-xs">

              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Ticket<span className="text-blue-500"> Vault</span>
              </span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-6 text-sm font-medium">
              <Link
                href="/events"
                className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
              >
                Events
              </Link>
              <Link href="/my-tickets" className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition">
                My Tickets
              </Link>
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/tickets/issue"
                className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
              >
                Issue Ticket
              </Link>
              <Link
                href="/scan"
                className="px-4 py-2 rounded-lg bg-gradient-to-r text-white font-semibold shadow-lg shadow-blue-500/20 transition flex items-center gap-1.5"
              >
                <span></span> Gate Scan
              </Link>
              <Link href="/profile" className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-1">
                 Profile
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Body */}
        <div className="flex-1">{children}</div>

        {/* Professional Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Ticket Vault Gateway. HMAC-SHA256 Cryptographically Secured.</p>
            <div className="flex gap-6 font-mono">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> System Operational
              </span>
              <span>Next.js App Router</span>
              <span>Prisma v6</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}