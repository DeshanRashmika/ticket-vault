"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/actions/event";

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    organizerId: "USER_ORGANIZER_01", 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const res = await createEvent({
      ...formData,
      date: new Date(formData.date),
    });

    if (res.success) {
      router.push("/events");
    } else {
      setError(res.error || "Failed to create event.");
    }
  } catch (err) {
    setError("An unexpected error occurred.");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 flex justify-center items-center">
      <div className="w-full max-w-xl bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <h1 className="text-2xl font-bold mb-2 text-white">Create New Event</h1>
        <p className="text-slate-400 text-sm mb-6">
          Fill in the details below to publish an event on the gateway.
        </p>

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 text-sm rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5">
              Event Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
              placeholder="e.g. Tech Conference 2026"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5">
              Location / Venue
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
              placeholder="e.g. Nelum Pokuna, Colombo"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5">
              Event Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
              placeholder="Provide event details..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition disabled:opacity-50 text-sm"
          >
            {loading ? "Creating Event..." : "Publish Event"}
          </button>
        </form>
      </div>
    </main>
  );
}