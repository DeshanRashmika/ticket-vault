import QrScanner from "@/components/qr-scanner";

export const metadata = {
  title: "Gatekeeper Check-In | Ticket Vault",
  description: "Live QR code scanning portal for event staff",
};

export default function ScannerPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
        <QrScanner />
      </div>
    </main>
  );
}