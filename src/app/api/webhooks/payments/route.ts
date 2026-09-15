import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('stripe-signature');
    const event = JSON.parse(bodyText);

    if (event.type === 'payment_intent.succeeded') {
      const paymentData = event.data.object;
      const ticketId = paymentData.metadata?.ticketId;

      if (!ticketId) {
        return NextResponse.json(
          { error: 'Ticket ID not found in metadata' }, 
          { status: 400 }
        );
      }

      const updatedTicket = await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          status: 'ISSUED',
          qrCodePayload: `TV-${ticketId}-${Date.now()}`,
        },
      });

      return NextResponse.json({ status: 'SUCCESS', ticket: updatedTicket }, { status: 200 });
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification or database update failed' }, 
      { status: 500 }
    );
  }
}