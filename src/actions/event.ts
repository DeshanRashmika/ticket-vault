"use server";

import { prisma } from "@/lib/prisma";
import { generateTicketQrPayload } from "@/lib/qr";

export async function createEvent(data: {
  title: string;
  date: Date;
  location: string;      
  organizerId: string;   
  description?: string;  
}) {
  try {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        date: new Date(data.date),
        location: data.location,
        organizerId: data.organizerId,
        ...(data.description && { description: data.description }),
      },
    });

    return { success: true, event };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, error: "FAILED_TO_CREATE_EVENT" };
  }
}

export async function issueTicket(data: {
  eventId: string;
  userId: string;
  price: number;
}) {
  try {
    const tempTicket = await prisma.ticket.create({
      data: {
        eventId: data.eventId,
        userId: data.userId,
        price: data.price,
        qrCodePayload: `PENDING_${Date.now()}`,
      },
    });

    const qrCodePayload = generateTicketQrPayload(tempTicket.id);

    const ticket = await prisma.ticket.update({
      where: { id: tempTicket.id },
      data: {
        qrCodePayload,
        status: "ISSUED",
      },
      include: { event: true, user: true },
    });

    return { success: true, ticket };
  } catch (error) {
    console.error("Failed to issue ticket:", error);
    return { success: false, error: "FAILED_TO_ISSUE_TICKET" };
  }
}