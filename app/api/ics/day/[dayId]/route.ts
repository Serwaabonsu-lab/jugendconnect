import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildIcsCalendar } from "@/lib/ics";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ dayId: string }> }
) {
  const { dayId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { data: day, error } = await supabase
    .from("event_days")
    .select("*, events(title)")
    .eq("id", dayId)
    .maybeSingle();

  if (error || !day) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }

  const eventTitle = (day as any).events?.title ?? "JugendConnect-Programm";
  const ics = buildIcsCalendar([
    {
      uid: `${day.id}@jugendconnect`,
      title: `${eventTitle} – ${day.day_label}`,
      description: eventTitle,
      location: day.location,
      date: day.date,
      time: day.time,
    },
  ]);

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${day.day_label.replace(/[^a-z0-9]+/gi, "-")}.ics"`,
    },
  });
}
