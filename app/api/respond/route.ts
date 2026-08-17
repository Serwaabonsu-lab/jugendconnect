import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notify } from "@/lib/twilio";

export async function POST(req: NextRequest) {
  const { token, action, reason } = await req.json();

  if (!token || (action !== "accepted" && action !== "declined")) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  if (action === "declined" && !reason?.trim()) {
    return NextResponse.json(
      { error: "Bitte gib eine Begründung für die Ablehnung an." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data: task, error: taskError } = await admin
    .from("tasks")
    .select("*, event_days(*, events(*))")
    .eq("response_token", token)
    .maybeSingle();

  if (taskError || !task) {
    return NextResponse.json({ error: "Aufgabe nicht gefunden." }, { status: 404 });
  }

  if (task.status !== "pending") {
    return NextResponse.json(
      { error: "Auf diese Aufgabe wurde bereits geantwortet." },
      { status: 409 }
    );
  }

  const { data: updatedTask, error: updateError } = await admin
    .from("tasks")
    .update({
      status: action,
      decline_reason: action === "declined" ? reason.trim() : null,
      responded_at: new Date().toISOString(),
    })
    .eq("id", task.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Zuteilenden Organisator über die Rückmeldung informieren.
  if (task.assigned_by) {
    const { data: organizer } = await admin
      .from("profiles")
      .select("*")
      .eq("id", task.assigned_by)
      .maybeSingle();
    const { data: assignee } = await admin
      .from("profiles")
      .select("*")
      .eq("id", task.assigned_to)
      .maybeSingle();

    if (organizer?.phone) {
      const day = (task as any).event_days;
      const statusText =
        action === "accepted"
          ? "hat die Aufgabe ANGENOMMEN."
          : `hat die Aufgabe ABGELEHNT. Begründung: "${reason.trim()}"`;
      const messageBody =
        `Rückmeldung: ${assignee?.full_name ?? "Jemand"} ${statusText} ` +
        `Aufgabe: "${task.label}"${day ? ` (${day.day_label}, ${day.date})` : ""} – JugendConnect`;
      try {
        await notify(organizer.phone, messageBody);
      } catch (err) {
        console.error("Organisator-Benachrichtigung fehlgeschlagen:", err);
      }
    }
  }

  return NextResponse.json({ ok: true, task: updatedTask });
}
