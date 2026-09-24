"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Deshan Rashmika",
    email: "deshan@ticketvault.com",
    role: "ORGANIZER", // ATTENDEE | ORGANIZER | GATEKEEPER
    memberSince: "March 2026",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    scanAlerts: true,
    twoFactorAuth: false,
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-white">Account & Settings</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your personal profile, role permissions, and notification preferences.
          </p>
        </div>

        {/* Saved Toast Alert */}
        {isSaved && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl flex items-center justify-between animate-fade-in">
            <span>✓ Settings updated successfully!</span>
            <span className="text-xs font-mono">{new Date().toLocaleTimeString()}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: User Profile Card */}
          <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center space-y-4 shadow-xl">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr flex items-center justify-center text-3xl font-extrabold text-white shadow-lg shadow-blue-500/20">
              {user.name.charAt(0)}
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5">{user.email}</p>
            </div>

            {/* Role Badge */}
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full">
               {user.role}
            </span>

            <div className="w-full pt-4 border-t border-slate-800/80 text-xs text-slate-500 space-y-2">
              <div className="flex justify-between">
                <span>Member Since:</span>
                <span className="text-slate-300 font-mono">{user.memberSince}</span>
              </div>
              <div className="flex justify-between">
                <span>Verification:</span>
                <span className="text-emerald-400 font-semibold">HMAC-Verified</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="w-full pt-4 space-y-2">
              <Link
                href="/my-tickets"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition block border border-slate-700"
              >
                 My Tickets Wallet
              </Link>
              {user.role === "ORGANIZER" && (
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold text-blue-400 rounded-xl transition block"
                >
                 Organizer Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Settings Forms */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Form 1: Profile Information */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                Profile Details
              </h3>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-blue-600/20"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>

            {/* Form 2: System & Security Preferences */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                Gateway Preferences & Security
              </h3>

              <div className="space-y-4 text-sm">
                
                {/* Toggle 1 */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-200">Email Notifications</p>
                    <p className="text-xs text-slate-500">Receive instant ticket confirmation PDFs via email.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="w-5 h-5 accent-sky-900 rounded cursor-pointer"
                  />
                </div>

                {/* Toggle 2 */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <div>
                    <p className="font-semibold text-slate-200">Real-time Gate Scan Alerts</p>
                    <p className="text-xs text-slate-500">Notify when your issued tickets are checked-in at the gate.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.scanAlerts}
                    onChange={(e) => setSettings({ ...settings, scanAlerts: e.target.checked })}
                    className="w-5 h-5 accent-sky-900 rounded cursor-pointer"
                  />
                </div>

                {/* Toggle 3 */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <div>
                    <p className="font-semibold text-slate-200">Cryptographic Signature Auto-Rotation</p>
                    <p className="text-xs text-slate-500">Enable advanced anti-tampering token rotation for passes.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                    className="w-5 h-5 accent-sky-900 rounded cursor-pointer"
                  />
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}