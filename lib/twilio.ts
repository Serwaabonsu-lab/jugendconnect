import twilio from "twilio";

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    throw new Error(
      "Twilio ist nicht konfiguriert: TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN fehlen."
    );
  }
  return twilio(sid, token);
}

/**
 * Normalisiert eine Telefonnummer für Twilio ins E.164-Format
 * (z.B. +491701234567). Deutsche Nummern werden ohne Ländervorwahl
 * eingegeben (z.B. 01701234567) - die führende 0 wird dann durch +49
 * ersetzt. Nummern, die bereits mit + beginnen, bleiben unverändert.
 */
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s()-]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("00")) return `+${cleaned.slice(2)}`;
  if (cleaned.startsWith("0")) return `+49${cleaned.slice(1)}`;
  return cleaned;
}

export async function sendSMS(to: string, body: string) {
  const client = getClient();
  const from = process.env.TWILIO_SMS_NUMBER;
  if (!from) throw new Error("TWILIO_SMS_NUMBER ist nicht gesetzt.");
  return client.messages.create({ to: normalizePhone(to), from, body });
}

export async function sendWhatsApp(to: string, body: string) {
  const client = getClient();
  const from = process.env.TWILIO_WHATSAPP_NUMBER;
  if (!from) throw new Error("TWILIO_WHATSAPP_NUMBER ist nicht gesetzt.");
  return client.messages.create({
    to: `whatsapp:${normalizePhone(to)}`,
    from: `whatsapp:${normalizePhone(from)}`,
    body,
  });
}

/**
 * Versendet dieselbe Nachricht per WhatsApp; schlägt der Versand fehl
 * (z.B. Nummer nicht bei WhatsApp registriert), wird automatisch per SMS
 * nachgesendet, damit die Person auf jeden Fall benachrichtigt wird.
 */
export async function notify(to: string, body: string) {
  try {
    await sendWhatsApp(to, body);
  } catch (err) {
    console.error("WhatsApp-Versand fehlgeschlagen, sende SMS als Fallback:", err);
    await sendSMS(to, body);
  }
}

