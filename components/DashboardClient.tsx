"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, EventRow, EventDay, TaskRow } from "@/types/database";

type EventWithDays = EventRow & {
  event_days: (EventDay & { tasks: TaskRow[] })[];
};

const STATUS_LABEL: Record<TaskRow["status"], string> = {
  pending: "Ausstehend",
  accepted: "Angenommen",
  declined: "Abgelehnt",
};

export default function DashboardClient({
  currentOrganizer,
  initialProfiles,
  initialEvents,
}: {
  currentOrganizer: Profile;
  initialProfiles: Profile[];
  initialEvents: EventWithDays[];
}) {
  const supabase = createClient();
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [events, setEvents] = useState<EventWithDays[]>(initialEvents);
  const [error, setError] = useState<string | null>(null);

  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");
  const [busy, setBusy] = useState(false);

  async function refreshEvents() {
    const { data } = await supabase
      .from("events")
      .select("*, event_days(*, tasks(*))")
      .order("start_date", { ascending: false });
    if (data) setEvents(data as unknown as EventWithDays[]);
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!newEventTitle || !newEventStart || !newEventEnd) return;
    setBusy(true);
    const { error } = await supabase.from("events").insert({
      title: newEventTitle,
      start_date: newEventStart,
      end_date: newEventEnd,
      created_by: currentOrganizer.id,
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setNewEventTitle("");
    setNewEventStart("");
    setNewEventEnd("");
    refreshEvents();
  }

  const members = profiles.filter((p) => p.role === "member");
  const organizers = profiles.filter((p) => p.role === "organizer");

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <a href="/" className="brand">
            <img src="/logo.png" alt="JugendConnect" />
            <span>JugendConnect – Organisator-Dashboard</span>
          </a>
          <button className="btn btn-outline" onClick={signOut}>
            Abmelden
          </button>
        </div>
      </header>

      <main className="app-main">
        {error && <div className="alert error">{error}</div>}

        <div className="app-grid-2">
          <div className="app-card">
            <h2>Registrierte Mitglieder</h2>
            <p className="muted">
              Alle Personen, die sich über die Website registriert haben. Du
              kannst sie unten Aufgaben zuteilen.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Kontakt</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 && (
                    <tr>
                      <td colSpan={2} className="muted">
                        Noch keine Registrierungen.
                      </td>
                    </tr>
                  )}
                  {members.map((m) => (
                    <tr key={m.id}>
                      <td>{m.full_name}</td>
                      <td>
                        {m.email}
                        {m.phone ? ` · ${m.phone}` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="app-card">
            <h2>Organisatoren</h2>
            <p className="muted">
              Personen mit Zugriff auf dieses Dashboard.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>E-Mail</th>
                  </tr>
                </thead>
                <tbody>
                  {organizers.map((o) => (
                    <tr key={o.id}>
                      <td>{o.full_name}</td>
                      <td>{o.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted" style={{ marginTop: 12 }}>
              Neue Organisatoren werden im Supabase-Dashboard freigeschaltet
              (Tabelle <code>profiles</code>, Feld <code>role</code> auf{" "}
              <code>organizer</code> setzen).
            </p>
          </div>
        </div>

        <div className="app-card">
          <h2>Neues Event anlegen</h2>
          <p className="muted">
            Ein Event kann mehrere Tage umfassen, jeder Tag mit eigener
            Uhrzeit, Ort und eigenen Aufgaben.
          </p>
          <form className="app-form" onSubmit={createEvent}>
            <label>Event-Titel</label>
            <input
              type="text"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder="z.B. ChristmasConvention 2026"
              required
            />
            <div className="app-grid-2">
              <div>
                <label>Start-Datum</label>
                <input
                  type="date"
                  value={newEventStart}
                  onChange={(e) => setNewEventStart(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>End-Datum</label>
                <input
                  type="date"
                  value={newEventEnd}
                  onChange={(e) => setNewEventEnd(e.target.value)}
                  required
                />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              Event anlegen
            </button>
          </form>
        </div>

        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            members={members}
            onChanged={refreshEvents}
          />
        ))}
      </main>
    </div>
  );
}

function EventCard({
  event,
  members,
  onChanged,
}: {
  event: EventWithDays;
  members: Profile[];
  onChanged: () => void;
}) {
  const supabase = createClient();
  const [dayLabel, setDayLabel] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);

  async function addDay(e: React.FormEvent) {
    e.preventDefault();
    if (!dayLabel || !date || !time || !location) return;
    setBusy(true);
    await supabase.from("event_days").insert({
      event_id: event.id,
      day_label: dayLabel,
      date,
      time,
      location,
    });
    setBusy(false);
    setDayLabel("");
    setDate("");
    setTime("");
    setLocation("");
    onChanged();
  }

  return (
    <div className="app-card">
      <h2>{event.title}</h2>
      <p className="muted">
        {event.start_date} – {event.end_date}
      </p>

      {event.event_days.map((day) => (
        <DayBlock key={day.id} day={day} members={members} onChanged={onChanged} />
      ))}

      <form
        className="app-form"
        onSubmit={addDay}
        style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 8 }}
      >
        <label>Neuer Tag</label>
        <div className="app-grid-2">
          <input
            type="text"
            placeholder="Bezeichnung (z.B. Tag 1)"
            value={dayLabel}
            onChange={(e) => setDayLabel(e.target.value)}
          />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="app-grid-2">
          <input
            type="text"
            placeholder="Uhrzeit (z.B. 18:00 Uhr)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ort / Adresse"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button className="btn btn-outline" type="submit" disabled={busy}>
          Tag hinzufügen
        </button>
      </form>
    </div>
  );
}

function DayBlock({
  day,
  members,
  onChanged,
}: {
  day: EventDay & { tasks: TaskRow[] };
  members: Profile[];
  onChanged: () => void;
}) {
  const supabase = createClient();
  const [taskLabel, setTaskLabel] = useState("");
  const [busy, setBusy] = useState(false);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!taskLabel) return;
    setBusy(true);
    await supabase.from("tasks").insert({
      event_day_id: day.id,
      label: taskLabel,
    });
    setBusy(false);
    setTaskLabel("");
    onChanged();
  }

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        background: "var(--surface)",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 2 }}>
        {day.day_label} · {day.date}
      </div>
      <div className="muted" style={{ fontSize: 12.5, marginBottom: 12 }}>
        {day.time} · {day.location}
      </div>

      {day.tasks.map((task) => (
        <TaskLine key={task.id} task={task} members={members} onChanged={onChanged} />
      ))}

      <form onSubmit={addTask} style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input
          type="text"
          placeholder="Neue Aufgabe (z.B. Chorprobe)"
          value={taskLabel}
          onChange={(e) => setTaskLabel(e.target.value)}
          style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 9, padding: "8px 12px", fontSize: 13 }}
        />
        <button className="btn btn-outline" type="submit" disabled={busy} style={{ padding: "8px 16px" }}>
          + Aufgabe
        </button>
      </form>
    </div>
  );
}

function TaskLine({
  task,
  members,
  onChanged,
}: {
  task: TaskRow;
  members: Profile[];
  onChanged: () => void;
}) {
  const [assigning, setAssigning] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const assignee = members.find((m) => m.id === task.assigned_to);

  async function assign(profileId: string) {
    if (!profileId) return;
    setAssigning(true);
    setWarning(null);
    try {
      const res = await fetch("/api/assign-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id, profileId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWarning(data.error || "Zuteilung fehlgeschlagen.");
      } else if (data.warning) {
        setWarning(data.warning);
      }
      onChanged();
    } catch {
      setWarning("Zuteilung fehlgeschlagen.");
    }
    setAssigning(false);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        padding: "9px 0",
        borderTop: "1px solid var(--border)",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13.5, fontWeight: 600 }}>{task.label}</span>
        <span className={`pill ${task.status === "pending" && !task.assigned_to ? "unassigned" : task.status}`}>
          {task.assigned_to ? STATUS_LABEL[task.status] : "Nicht zugeteilt"}
        </span>
        {task.status === "declined" && task.decline_reason && (
          <span className="muted" style={{ fontSize: 12 }}>
            Begründung: {task.decline_reason}
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <select
          disabled={assigning}
          value={task.assigned_to ?? ""}
          onChange={(e) => assign(e.target.value)}
          style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", fontSize: 12.5 }}
        >
          <option value="">Person zuteilen…</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name}
            </option>
          ))}
        </select>
      </div>
      {warning && (
        <div className="alert error" style={{ width: "100%", marginTop: 8, marginBottom: 0 }}>
          {warning}
        </div>
      )}
    </div>
  );
}
