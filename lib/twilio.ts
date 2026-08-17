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
 * Normalisiert eine Telefonnummer minimal für Twilio (E.164 wird erwartet,
 * z.B. +491701234567). Nimmt an, dass die Nummer bereits mit Ländercode
 * eingegeben wurde; entfernt nur Leerzeichen/Bindestriche.
 */
function normalizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, "");
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
