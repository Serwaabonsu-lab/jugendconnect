"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    if (password !== confirm) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
    setTimeout(() => {
      window.location.href = "/programme";
    }, 1500);
  }

  return (
    <div className="center-page">
      <div className="center-box">
        <img src="/logo.png" className="logo" alt="JugendConnect" />
        <h1>Neues Passwort festlegen</h1>
        {done ? (
          <div className="alert success">
            Passwort gespeichert! Du wirst weitergeleitet...
          </div>
        ) : (
          <form className="app-form" onSubmit={submit} style={{ textAlign: "left" }}>
            {error && <div className="alert error">{error}</div>}
            <label>Neues Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              autoComplete="new-password"
            />
            <label>Passwort bestätigen</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={8}
              required
              autoComplete="new-password"
            />
            <button className="btn btn-primary" type="submit" disabled={busy} style={{ width: "100%" }}>
              Passwort speichern
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
