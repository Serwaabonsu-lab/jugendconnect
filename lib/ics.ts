function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/**
 * Versucht eine Uhrzeit (Freitext wie "18:00 Uhr" oder "6:00 PM") grob zu
 * einer Stunde/Minute zu parsen. Gibt null zurück, wenn kein Muster
 * gefunden wird - dann wird ein ganztägiger Kalendereintrag erzeugt.
 */
function parseTime(timeStr: string): { h: number; m: number } | null {
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (/pm/i.test(timeStr) && h < 12) h += 12;
  if (/am/i.test(timeStr) && h === 12) h = 0;
  if (h > 23 || m > 59) return null;
  return { h, m };
}

function escapeIcsText(text: string): string {
  return text.replace(/[\\;,]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
}

export interface IcsEventInput {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  date: string; // YYYY-MM-DD
  time: string; // Freitext, z.B. "18:00 Uhr"
  durationHours?: number;
}

export function buildIcsEvent(input: IcsEventInput): string {
  const [year, month, day] = input.date.split("-").map(Number);
  const parsedTime = parseTime(input.time);
  const duration = input.durationHours ?? 2;

  let dtStart: string;
  let dtEnd: string;
  let allDay = false;

  if (parsedTime) {
    const start = new Date(year, month - 1, day, parsedTime.h, parsedTime.m);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
    dtStart = `${start.getFullYear()}${pad(start.getMonth() + 1)}${pad(start.getDate())}T${pad(start.getHours())}${pad(start.getMinutes())}00`;
    dtEnd = `${end.getFullYear()}${pad(end.getMonth() + 1)}${pad(end.getDate())}T${pad(end.getHours())}${pad(end.getMinutes())}00`;
  } else {
    allDay = true;
    const end = new Date(year, month - 1, day + 1);
    dtStart = `${year}${pad(month)}${pad(day)}`;
    dtEnd = `${end.getFullYear()}${pad(end.getMonth() + 1)}${pad(end.getDate())}`;
  }

  const lines = [
    "BEGIN:VEVENT",
    `UID:${input.uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    allDay ? `DTSTART;VALUE=DATE:${dtStart}` : `DTSTART:${dtStart}`,
    allDay ? `DTEND;VALUE=DATE:${dtEnd}` : `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(input.title)}`,
  ];
  if (input.description) lines.push(`DESCRIPTION:${escapeIcsText(input.description)}`);
  if (input.location) lines.push(`LOCATION:${escapeIcsText(input.location)}`);
  lines.push("END:VEVENT");
  return lines.join("\r\n");
}

export function buildIcsCalendar(events: IcsEventInput[]): string {
  const body = events.map(buildIcsEvent).join("\r\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//JugendConnect//DE",
    "CALSCALE:GREGORIAN",
    body,
    "END:VCALENDAR",
  ].join("\r\n");
}
