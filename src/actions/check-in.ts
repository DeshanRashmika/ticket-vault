"use server";

import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";

export async function checkInTicket(qrCodePayload: string) {
    try {
        return await prisma.$transaction(async (tx) => {
            const ticket = await tx.ticket.findUnique({
                where: { qrCodePayload },
                include: { event: true, user: true },
            });

            if (!ticket) {
                return { success: false, error: "INVALID_TICKET" };
            }

            if (ticket.status === TicketStatus.CHECKED_IN) {
                return {
                    success: false,
                    error: "ALREADY_USED",
                    scannedAt: ticket.updatedAt,
                };
            }

            if (ticket.status === TicketStatus.CANCELLED) {
                return { success: false, error: "TICKET_CANCELLED" };
            }

            const updatedTicket = await tx.ticket.update({
                where: { id: ticket.id },
                data: { status: TicketStatus.CHECKED_IN },
            });

            return {
                success: true,
                ticket: updatedTicket,
                event: ticket.event,
                attendee: ticket.user,
            };
        });
    } catch (error) {
        console.error("Check-in Transaction Error:", error);
        return { success: false, error: "INTERNAL_SERVER_ERROR" };
    }
}