import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 0;

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: {
      _count: { select: { tickets: true } },
    },
    orderBy: { date: "asc" },
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Upcoming Events</h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse active events and manage ticket issuance.
          </p>
        </div>
        <Link
          href="/events/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition text-white"
        >
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">No upcoming events scheduled right now.</p>
          <Link href="/events/new" className="text-blue-400 hover:underline text-xs mt-2 inline-block">
            Create the first event →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition shadow-lg group"
            >
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <h3 className="text-xl font-bold text-white mt-3 group-hover:text-blue-400 transition">
                  {event.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                   {event.location}
                </p>
                {event.description && (
                  <p className="text-slate-400 text-sm mt-3 line-clamp-2">{event.description}</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  {event._count.tickets} Tickets Issued
                </span>
                <Link
                  href={`/tickets/issue?eventId=${event.id}`}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg transition"
                >
                  Issue Ticket →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}