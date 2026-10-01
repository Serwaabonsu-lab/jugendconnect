import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ProgrammePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="center-page">
        <div className="center-box">
          <img src="/logo.png" className="logo" alt="JugendConnect" />
          <h1>Anmeldung erforderlich</h1>
          <p>
            Melde dich an, um die kommenden Programme einzusehen.
          </p>
          <Link href="/" className="btn btn-primary">
            Zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const today = new Date().toISOString().slice(0, 10);

  const { data: events } = await supabase
    .from("events")
    .select("*, event_days(*)")
    .gte("end_date", today)
    .order("start_date", { ascending: true });

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <a href="/" className="brand">
            <img src="/logo.png" alt="JugendConnect" />
            <span>JugendConnect</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {profile && (
              <span className="muted" style={{ fontSize: 13 }}>
                {profile.full_name}
              </span>
            )}
            {profile?.role === "organizer" && (
              <Link href="/dashboard" className="btn btn-outline">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="app-card">
          <h2>Kommende Programme</h2>
          <p className="muted">
            Alle anstehenden Events mit Terminen, Uhrzeiten und Orten.
          </p>
        </div>

        {(!events || events.length === 0) && (
          <div className="app-card">
            <p className="muted" style={{ margin: 0 }}>
              Aktuell sind keine kommenden Programme eingetragen.
            </p>
          </div>
        )}

        {(events as any[] | null)?.map((event) => {
          const days = [...(event.event_days ?? [])].sort((a, b) =>
            a.date.localeCompare(b.date)
          );
          return (
            <div className="app-card" key={event.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2 style={{ marginBottom: 4 }}>{event.title}</h2>
                  <p className="muted" style={{ margin: 0 }}>
                    {event.start_date} – {event.end_date}
                  </p>
                </div>
                <a
                  className="btn btn-outline"
                  href={`/api/ics/event/${event.id}`}
                  style={{ flexShrink: 0 }}
                >
                  Ganzes Programm zum Kalender hinzufügen
                </a>
              </div>

              <div style={{ marginTop: 18 }}>
                {days.map((day: any) => (
                  <div
                    key={day.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                      padding: "14px 0",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        {day.day_label} · {day.date}
                      </div>
                      <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
                        {day.time} · {day.location}
                      </div>
                    </div>
                    <a
                      className="btn btn-outline"
                      href={`/api/ics/day/${day.id}`}
                      style={{ fontSize: 12.5, padding: "8px 14px" }}
                    >
                      Zum Kalender hinzufügen
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
