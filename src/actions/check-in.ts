"use server";

import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";
import crypto from "crypto";

export async function verifyAndCheckInTicket(payload: string) {
  try {
    if (!payload || !payload.includes(".")) {
      return { success: false, error: "Invalid QR code payload format" };
    }

    const [ticketId, signature] = payload.split(".");

    if (!ticketId || !signature) {
      return { success: false, error: "Malformed payload structure" };
    }

    const secret = process.env.QR_SECRET || "default_secret_key";
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(ticketId)
      .digest("hex");

    if (signature !== expectedSignature) {
      return { success: false, error: "Invalid signature! Verification failed." };
    }

    return await prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketId },
        include: {
          event: { select: { title: true } },
          user: { select: { email: true } },
        },
      });

      if (!ticket) {
        return { success: false, error: "Ticket not found in database" };
      }

      if (ticket.status === TicketStatus.CHECKED_IN) {
        return { success: false, error: "Ticket has ALREADY been scanned/used!" };
      }

      if (ticket.status === TicketStatus.CANCELLED) {
        return { success: false, error: "Ticket is CANCELLED" };
      }

      const updatedTicket = await tx.ticket.update({
        where: { id: ticketId },
        data: { status: TicketStatus.CHECKED_IN },
        include: {
          event: { select: { title: true } },
          user: { select: { email: true } },
        },
      });

      return {
        success: true,
        ticket: updatedTicket,
      };
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return { success: false, error: "Server error during check-in processing" };
  }
}