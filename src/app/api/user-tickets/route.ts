import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ success: false, error: "Search query is required" }, { status: 400 });
    }

    // Email එකකින් හෝ User ID එකකින් Match වන Tickets සෙවීම
    const tickets = await prisma.ticket.findMany({
      where: {
        OR: [
          { userId: query },
          { user: { email: { equals: query, mode: "insensitive" } } },
        ],
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            location: true,
            date: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error("User tickets query error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tickets" }, { status: 500 });
  }
}