# JugendConnect

Next.js-App für JugendConnect: Marketing-Seite + Programm-Übersicht für
Mitglieder + Organisator-Dashboard mit echter Datenbank (Supabase) und
automatischen SMS/WhatsApp-Benachrichtigungen (Twilio) bei Aufgabenzuteilung
und Rückmeldung.

## Wie es funktioniert

1. **Registrierung** (Startseite, "Jetzt starten"): Name, E-Mail, Passwort,
   Telefonnummer und Geburtsdatum. Legt ein echtes Supabase-Auth-Konto an
   und speichert die Angaben in der `profiles`-Tabelle (Rolle `member`).
2. **Anmeldung** (Startseite, "Anmelden"): E-Mail + Passwort, für Mitglieder
   und Organisatoren gleichermaßen.
3. **Programme** (`/programme`): Jede angemeldete Person sieht die
   kommenden Events mit allen Tagen, Uhrzeiten und Orten, und kann jeden
   Tag oder das ganze Programm per Klick dem eigenen Kalender (Google/
   Apple/Outlook, über eine .ics-Datei) hinzufügen.
4. **Dashboard** (`/dashboard`, nur Organisatoren): registrierte Personen
   einsehen, Events mit mehreren Tagen anlegen (jeder Tag mit eigener
   Uhrzeit/Ort) und pro Tag Aufgaben an Personen zuteilen.
5. **Zuteilung**: Sobald eine Aufgabe zugeteilt wird, verschickt die App
   automatisch eine WhatsApp-Nachricht (Fallback: SMS) mit einem
   persönlichen Link an die zugeteilte Person.
6. **Rückmeldung** (`/respond/[token]`, kein Login nötig): Die Person nimmt
   die Aufgabe an oder lehnt sie mit Begründung ab.
7. **Benachrichtigung des Organisators**: Nach der Rückmeldung erhält der
   Organisator, der die Aufgabe zugeteilt hat, automatisch eine
   SMS/WhatsApp-Nachricht mit dem Ergebnis.

## 1. Voraussetzungen einrichten

### Supabase (Datenbank + Login)

1. Kostenlosen Account auf [supabase.com](https://supabase.com) erstellen
   und ein neues Projekt anlegen.
2. Unter **Project Settings → API** findest du:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` / `publishable` Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` / `secret` Key (geheim!) → `SUPABASE_SERVICE_ROLE_KEY`
3. Unter **SQL Editor** zuerst den Inhalt von
   [`supabase/schema.sql`](./supabase/schema.sql) ausführen (Grundschema),
   danach [`supabase/migration_002_password_auth.sql`](./supabase/migration_002_password_auth.sql)
   (Passwort-Login + Programm-Ansicht für Mitglieder).
4. **Wichtig:** Unter **Authentication → Providers → Email** den Schalter
   **"Confirm email"** deaktivieren, damit sich neue Konten direkt nach der
   Registrierung anmelden können, ohne auf eine Bestätigungs-E-Mail warten
   zu müssen.
5. Damit mindestens eine Person Organisator wird: Nach der ersten
   Registrierung im SQL Editor ausführen:
   ```sql
   update public.profiles set role = 'organizer' where email = 'deine@email.de';
   ```

### Twilio (SMS & WhatsApp für Aufgabenzuteilung)

1. Account auf [twilio.com](https://www.twilio.com) erstellen (Trial-Konto
   reicht zum Testen, hat aber Einschränkungen bei der Empfängerzahl).
2. Im Twilio-Dashboard `Account SID` und `Auth Token` kopieren →
   `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN`.
3. Für SMS: eine Telefonnummer kaufen/aktivieren → `TWILIO_SMS_NUMBER`.
4. Für WhatsApp: Twilio bietet zum Testen eine **WhatsApp Sandbox**
   (kostenlos, jeder Empfänger muss sich einmalig per WhatsApp-Nachricht mit
   einem Beitrittscode registrieren) — Nummer meist `+14155238886`. Für den
   echten Produktivbetrieb muss eine eigene WhatsApp Business-Nummer über
   Twilio freigeschaltet werden (Meta-Verifizierung nötig, dauert einige
   Tage). Bis dahin funktioniert die App automatisch mit SMS als Fallback,
   falls WhatsApp fehlschlägt (siehe `lib/twilio.ts`).

## 2. Lokal einrichten

```bash
npm install
cp .env.example .env.local
# .env.local mit den Werten aus Schritt 1 befüllen
npm run dev
```

Die Seite läuft dann auf http://localhost:3000.

## 3. Deployment auf Vercel

1. Repository mit Vercel verbinden (neues Projekt → GitHub-Repo auswählen).
2. Unter **Project Settings → Environment Variables** alle Variablen aus
   `.env.example` eintragen (mit deinen echten Werten aus Schritt 1).
   `NEXT_PUBLIC_APP_URL` auf die endgültige Vercel-Domain setzen (z.B.
   `https://jugendconnect.vercel.app`).
3. Deployen. Jeder Push erzeugt automatisch eine Vorschau-URL zum Testen.

## Projektstruktur

```
app/
  page.tsx                Marketing-/Landingpage
  programme/page.tsx       Programm-Übersicht für alle angemeldeten Nutzer
  dashboard/page.tsx       Organisator-Dashboard (geschützt)
  respond/[token]/page.tsx Öffentliche Annahme/Ablehnung-Seite
  auth/callback/route.ts   Fängt Supabase-E-Mail-Bestätigungslinks ab
  api/assign-task/route.ts Aufgabe zuteilen + SMS/WhatsApp senden
  api/respond/route.ts     Rückmeldung verarbeiten + Organisator benachrichtigen
  api/ics/day/[dayId]/route.ts     .ics-Download für einen einzelnen Tag
  api/ics/event/[eventId]/route.ts .ics-Download für ein ganzes Event
components/
  MarketingClient.tsx       Rendert die Landingpage + bindet marketing-script.ts ein
  DashboardClient.tsx       Interaktives Dashboard (Events/Tage/Aufgaben/Zuteilung)
  RespondForm.tsx           Annehmen/Ablehnen-Formular
lib/
  supabase/                Browser-, Server- und Admin-Client
  twilio.ts                 SMS/WhatsApp-Versand (mit Fallback)
  ics.ts                    .ics-Kalenderdatei-Generator
  marketing-content.ts       Extrahiertes HTML der bisherigen Seite
  marketing-script.ts        Extrahierte Interaktivität (i18n, Demo, Auth)
supabase/
  schema.sql                        Grundschema + Row-Level-Security
  migration_002_password_auth.sql   Passwort-Login + Programm-Ansicht
```

## Bekannte Grenzen (MVP)

- Neue Organisatoren werden manuell per SQL freigeschaltet (kein
  Self-Service-Upgrade), aus Sicherheitsgründen.
- Twilio-Trial-Konten können nur an verifizierte Nummern senden — für den
  echten Betrieb ist ein bezahltes Twilio-Konto nötig.
- WhatsApp erfordert entweder die Twilio-Sandbox (Empfänger müssen
  beitreten) oder eine freigeschaltete WhatsApp Business-Nummer.
- Personen, die sich über die alte Registrierung (vor dem Passwort-Login)
  angemeldet haben, müssen sich einmalig neu registrieren, da ihnen ein
  Supabase-Auth-Konto fehlt.

