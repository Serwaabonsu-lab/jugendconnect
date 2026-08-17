import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notify } from "@/lib/twilio";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { data: organizerProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!organizerProfile || organizerProfile.role !== "organizer") {
    return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403 });
  }

  const { taskId, profileId } = await req.json();
  if (!taskId || !profileId) {
    return NextResponse.json(
      { error: "taskId und profileId sind erforderlich." },
      { status: 400 }
    );
  }

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("*, event_days(*, events(*))")
    .eq("id", taskId)
    .maybeSingle();

  if (taskError || !task) {
    return NextResponse.json({ error: "Aufgabe nicht gefunden." }, { status: 404 });
  }

  const { data: assignee, error: assigneeError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();

  if (assigneeError || !assignee) {
    return NextResponse.json({ error: "Person nicht gefunden." }, { status: 404 });
  }

  const { data: updatedTask, error: updateError } = await supabase
    .from("tasks")
    .update({
      assigned_to: profileId,
      assigned_by: organizerProfile.id,
      status: "pending",
      decline_reason: null,
      responded_at: null,
      notified_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const day = (task as any).event_days;
  const event = day?.events;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  const responseLink = `${appUrl}/respond/${updatedTask.response_token}`;

  const messageBody =
    `Hallo ${assignee.full_name}, du wurdest für "${task.label}" ` +
    `bei ${event?.title ?? "einem Event"}${day ? ` (${day.day_label}, ${day.date}, ${day.time}, ${day.location})` : ""} ` +
    `eingeteilt. Bitte antworte hier: ${responseLink} – JugendConnect`;

  let notifyError: string | null = null;
  if (assignee.phone) {
    try {
      await notify(assignee.phone, messageBody);
    } catch (err) {
      console.error("Benachrichtigung fehlgeschlagen:", err);
      notifyError =
        "Aufgabe wurde zugeteilt, aber die SMS/WhatsApp-Benachrichtigung ist fehlgeschlagen. Bitte prüfe die Twilio-Konfiguration.";
    }
  } else {
    notifyError =
      "Aufgabe wurde zugeteilt, aber die Person hat keine Telefonnummer hinterlegt.";
  }

  return NextResponse.json({ ok: true, task: updatedTask, warning: notifyError });
}
