"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/actions/auth";
import { Role } from "@prisma/client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(Role.ATTENDEE);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await registerUser({
      name,
      email,
      password,
      role,
    });

    if (!res.success) {
      setError(res.error || "Failed to register account");
      setLoading(false);
    } else {
      // Registration සාර්ථක නම් Login Page එකට Redirect කිරීම
      router.push("/login?registered=true");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create Vault Account</h1>
          <p className="text-slate-400 text-xs mt-1">
            Join Ticket Vault to issue, manage, or scan event passes
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-500/50 text-red-300 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 font-mono"
              placeholder="user@vault.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
              Account Type (Role)
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value={Role.ATTENDEE}>Attendee (Event Visitor)</option>
              <option value={Role.ORGANIZER}>Organizer (Create & Manage Events)</option>
              <option value={Role.GATEKEEPER}>Gatekeeper (Scan Gate QR Passes)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg transition disabled:opacity-50 mt-2"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
}