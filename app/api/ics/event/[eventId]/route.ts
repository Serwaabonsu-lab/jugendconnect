import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildIcsCalendar } from "@/lib/ics";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { data: event, error } = await supabase
    .from("events")
    .select("*, event_days(*)")
    .eq("id", eventId)
    .maybeSingle();

  if (error || !event) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }

  const days = (event as any).event_days as {
    id: string;
    day_label: string;
    date: string;
    time: string;
    location: string;
  }[];

  const ics = buildIcsCalendar(
    days.map((day) => ({
      uid: `${day.id}@jugendconnect`,
      title: `${event.title} – ${day.day_label}`,
      description: event.title,
      location: day.location,
      date: day.date,
      time: day.time,
    }))
  );

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.title.replace(/[^a-z0-9]+/gi, "-")}.ics"`,
    },
  });
}
