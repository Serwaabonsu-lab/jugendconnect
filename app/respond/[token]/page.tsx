import { createAdminClient } from "@/lib/supabase/admin";
import RespondForm from "@/components/RespondForm";

export default async function RespondPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: task } = await admin
    .from("tasks")
    .select("*, event_days(*, events(*)), assignee:assigned_to(full_name)")
    .eq("response_token", token)
    .maybeSingle();

  if (!task) {
    return (
      <div className="center-page">
        <div className="center-box">
          <img src="/logo.png" className="logo" alt="JugendConnect" />
          <h1>Link nicht gültig</h1>
          <p>Dieser Rückmeldungs-Link wurde nicht gefunden oder ist abgelaufen.</p>
        </div>
      </div>
    );
  }

  const day = (task as any).event_days;
  const event = day?.events;
  const assigneeName = (task as any).assignee?.full_name ?? "";

  return (
    <div className="center-page">
      <div className="center-box" style={{ maxWidth: 480 }}>
        <img src="/logo.png" className="logo" alt="JugendConnect" />
        <h1>{task.label}</h1>
        <p>
          {assigneeName && (
            <>
              Hallo {assigneeName}! <br />
            </>
          )}
          {event?.title}
          {day ? ` · ${day.day_label}, ${day.date} · ${day.time} · ${day.location}` : ""}
        </p>
        <RespondForm token={token} initialStatus={task.status} />
      </div>
    </div>
  );
}
