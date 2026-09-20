import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";
import Link from "next/link";

export const revalidate = 0; 

export default async function DashboardPage() {
  const [totalEvents, totalTickets, totalCheckedIn, events] = await Promise.all([
    prisma.event.count(),
    prisma.ticket.count(),
    prisma.ticket.count({
      where: { status: TicketStatus.CHECKED_IN },
    }),
    prisma.event.findMany({
      include: {
        tickets: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const checkInRate = totalTickets > 0 ? ((totalCheckedIn / totalTickets) * 100).toFixed(1) : "0";

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organizer Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time event overview, ticket issuance & gate attendance analytics.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/events/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition"
            >
              + Create Event
            </Link>
            <Link
              href="/tickets/issue"
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold transition"
            >
              + Issue Ticket
            </Link>
            <Link
              href="/scan"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-semibold transition"
            >
              📷 Gate Scanner
            </Link>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Events</span>
            <div className="text-3xl font-extrabold mt-2 text-blue-400">{totalEvents}</div>
          </div>

          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Tickets Issued</span>
            <div className="text-3xl font-extrabold mt-2 text-indigo-400">{totalTickets}</div>
          </div>

          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Checked-In</span>
            <div className="text-3xl font-extrabold mt-2 text-green-400">{totalCheckedIn}</div>
          </div>

          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Turnout Rate</span>
            <div className="text-3xl font-extrabold mt-2 text-amber-400">{checkInRate}%</div>
          </div>
        </div>

        {/* Events & Attendance Table */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 overflow-hidden">
          <h2 className="text-xl font-bold mb-4">Event Attendance Summary</h2>

          {events.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No events found. Create your first event to see stats.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-xs uppercase text-slate-400">
                    <th className="py-3 px-4">Event Name</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Total Issued</th>
                    <th className="py-3 px-4">Checked-In</th>
                    <th className="py-3 px-4">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-sm">
                  {events.map((event) => {
                    const issued = event.tickets.length;
                    const checked = event.tickets.filter((t) => t.status === TicketStatus.CHECKED_IN).length;
                    const pct = issued > 0 ? Math.round((checked / issued) * 100) : 0;

                    return (
                      <tr key={event.id} className="hover:bg-slate-700/30 transition">
                        <td className="py-3.5 px-4 font-semibold text-white">{event.title}</td>
                        <td className="py-3.5 px-4 text-slate-300">{event.location}</td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {new Date(event.date).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono">{issued}</td>
                        <td className="py-3.5 px-4 font-mono text-green-400">{checked}</td>
                        <td className="py-3.5 px-4 w-40">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-green-500 h-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400 font-mono">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}