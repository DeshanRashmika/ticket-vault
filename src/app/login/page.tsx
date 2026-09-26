"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const isRegistered = searchParams.get("registered") === "true";
    {
        isRegistered && (
            <div className="p-3 bg-emerald-900/50 border border-emerald-500/50 text-emerald-300 text-xs rounded-lg text-center">
                Account created successfully! Please sign in.
            </div>
        )
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid email or password.");
            setLoading(false);
        } else {
            router.push("/events");
            router.refresh();
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Sign In to Ticket Vault</h1>
                    <p className="text-slate-400 text-xs mt-1">Access your account and verified event passes</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-900/50 border border-red-500/50 text-red-300 text-xs rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Email</label>
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
                        <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                <p className="text-xs text-center text-slate-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-blue-400 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </main>
    );
}