import crypto from "crypto";

const SECRET_KEY = process.env.QR_SECRET || "default_fallback_secret_key";

export function generateTicketQrPayload(ticketId: string): string {
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(ticketId);
  const signature = hmac.digest("hex").substring(0, 16); 

  return `${ticketId}.${signature}`;
}

export function verifyTicketQrPayload(payload: string): { valid: boolean; ticketId?: string } {
  if (!payload || !payload.includes(".")) {
    return { valid: false };
  }

  const [ticketId, signature] = payload.split(".");
  if (!ticketId || !signature) {
    return { valid: false };
  }

  const expectedPayload = generateTicketQrPayload(ticketId);

  const isMatch = crypto.timingSafeEqual(
    Buffer.from(payload),
    Buffer.from(expectedPayload)
  );

  if (!isMatch) {
    return { valid: false };
  }

  return { valid: true, ticketId };
}