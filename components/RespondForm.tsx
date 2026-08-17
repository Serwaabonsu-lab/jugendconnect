"use client";

import { useState } from "react";
import type { TaskStatus } from "@/types/database";

export default function RespondForm({
  token,
  initialStatus,
}: {
  token: string;
  initialStatus: TaskStatus;
}) {
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [showDecline, setShowDecline] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(action: "accepted" | "declined") {
    setError(null);
    if (action === "declined" && !reason.trim()) {
      setShowDecline(true);
      setError("Bitte gib eine Begründung an.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Etwas ist schiefgelaufen.");
        setBusy(false);
        return;
      }
      setStatus(action);
    } catch {
      setError("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    }
    setBusy(false);
  }

  if (status === "accepted") {
    return (
      <div className="alert success">
        Danke! Du hast die Aufgabe angenommen. Der Organisator wurde informiert.
      </div>
    );
  }
  if (status === "declined") {
    return (
      <div className="alert info">
        Du hast diese Aufgabe abgelehnt. Der Organisator wurde informiert.
      </div>
    );
  }

  return (
    <div style={{ textAlign: "left" }}>
      {error && <div className="alert error">{error}</div>}
      {!showDecline ? (
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={busy}
            onClick={() => submit("accepted")}
          >
            Annehmen
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ flex: 1 }}
            disabled={busy}
            onClick={() => setShowDecline(true)}
          >
            Ablehnen
          </button>
        </div>
      ) : (
        <div className="app-form">
          <label>Begründung für die Ablehnung</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="z.B. bin an dem Tag verhindert..."
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={busy}
              onClick={() => submit("declined")}
            >
              Ablehnung senden
            </button>
            <button
              type="button"
              className="btn btn-outline"
              disabled={busy}
              onClick={() => setShowDecline(false)}
            >
              Zurück
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
