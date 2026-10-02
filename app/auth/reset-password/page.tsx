"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const supabaseRef = useRef(createClient());
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(false);

  useEffect(() => {
    const supabase = supabaseRef.current;

    async function init() {
      // Supabase schickt den Reset-Link entweder mit ?code=... (PKCE) oder
      // mit Zugangsdaten im URL-Hash (#access_token=...&type=recovery).
      // Beide Fälle hier abfangen, bevor das Formular freigegeben wird.
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setLinkInvalid(true);
          return;
        }
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setReady(true);
      } else {
        setLinkInvalid(true);
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
        setLinkInvalid(false);
      }
    });

    init();

    return () => listener.subscription.unsubscribe();
  }, []);

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
    const { error: updateError } = await supabaseRef.current.auth.updateUser({ password });
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
        ) : linkInvalid ? (
          <div className="alert error">
            Dieser Link ist ungültig oder abgelaufen. Bitte fordere über
            &quot;Passwort vergessen?&quot; einen neuen Link an.
          </div>
        ) : !ready ? (
          <p className="muted">Link wird geprüft...</p>
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
