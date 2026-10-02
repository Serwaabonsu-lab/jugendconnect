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
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const supabase = supabaseRef.current;

    async function init() {
      // Supabase hängt bei einem ungültigen/abgelaufenen Link oft direkt
      // eine Fehlerbeschreibung an die URL an (?error=...&error_description=...
      // oder im Hash). Das hier auslesen, um die echte Ursache zu zeigen.
      const search = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const urlError = search.get("error_description") || hash.get("error_description")
        || search.get("error") || hash.get("error");
      if (urlError) {
        setDebugInfo(decodeURIComponent(urlError));
        setLinkInvalid(true);
        return;
      }

      const code = search.get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setDebugInfo(exchangeError.message);
          setLinkInvalid(true);
          return;
        }
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setReady(true);
      } else if (!hash.get("access_token")) {
        // Kein Code, kein Hash-Token, keine Session: Link enthielt nichts
        // Verwertbares.
        setDebugInfo(
          "Keine Zugangsdaten in der Adresse gefunden (weder ?code= noch #access_token=)."
        );
        setLinkInvalid(true);
      }
      // Falls ein #access_token im Hash steckt, aber getSession() noch keine
      // Session zeigt, verarbeitet der Supabase-Client das gerade noch -
      // das PASSWORD_RECOVERY-Event unten übernimmt dann.
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
            {debugInfo.includes("code verifier") ? (
              <>
                Dieser Link wurde auf einem anderen Gerät oder Browser
                geöffnet als dem, auf dem du ihn angefordert hast. Bitte
                fordere &quot;Passwort vergessen?&quot; erneut an und öffne
                die E-Mail diesmal auf demselben Gerät/Browser.
              </>
            ) : (
              <>
                Dieser Link ist ungültig oder abgelaufen. Bitte fordere über
                &quot;Passwort vergessen?&quot; einen neuen Link an.
              </>
            )}
            {debugInfo && (
              <div style={{ marginTop: 8, fontSize: 11.5, opacity: 0.8 }}>
                Technische Info: {debugInfo}
              </div>
            )}
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
