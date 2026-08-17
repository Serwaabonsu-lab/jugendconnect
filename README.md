# JugendConnect

Next.js-App für JugendConnect: Marketing-Seite + Organisator-Dashboard mit
echter Datenbank (Supabase) und automatischen SMS/WhatsApp-Benachrichtigungen
(Twilio) bei Aufgabenzuteilung und Rückmeldung.

## Wie es funktioniert

1. **Registrierung** (Startseite, "Jetzt starten"): Jede Person trägt Name,
   E-Mail, Telefonnummer und Geburtsdatum ein. Der Eintrag landet direkt in
   der `profiles`-Tabelle (Rolle `member`) und ist sofort im
   Organisator-Dashboard sichtbar.
2. **Anmeldung** (Startseite, "Anmelden" bzw. Footer "Für Organisatoren"):
   Nur für Organisatoren. Es wird kein Passwort verwendet, sondern ein
   Magic-Link per E-Mail (Supabase Auth).
3. **Dashboard** (`/dashboard`): Organisatoren sehen alle registrierten
   Personen, legen Events mit mehreren Tagen an (jeder Tag mit eigener
   Uhrzeit/Ort) und teilen pro Tag Aufgaben an Personen zu.
4. **Zuteilung**: Sobald eine Aufgabe zugeteilt wird, verschickt die App
   automatisch eine WhatsApp-Nachricht (Fallback: SMS) mit einem
   persönlichen Link an die zugeteilte Person.
5. **Rückmeldung** (`/respond/[token]`, kein Login nötig): Die Person nimmt
   die Aufgabe an oder lehnt sie mit Begründung ab.
6. **Benachrichtigung des Organisators**: Nach der Rückmeldung erhält der
   Organisator, der die Aufgabe zugeteilt hat, automatisch eine
   SMS/WhatsApp-Nachricht mit dem Ergebnis.

## 1. Voraussetzungen einrichten

### Supabase (Datenbank + Login)

1. Kostenlosen Account auf [supabase.com](https://supabase.com) erstellen
   und ein neues Projekt anlegen.
2. Unter **Project Settings → API** findest du:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` Key (geheim!) → `SUPABASE_SERVICE_ROLE_KEY`
3. Unter **SQL Editor** den Inhalt von [`supabase/schema.sql`](./supabase/schema.sql)
   einfügen und ausführen. Das legt alle Tabellen und Sicherheitsregeln an.
4. Damit sich mindestens eine Person als Organisator anmelden kann: Nach dem
   ersten Anmelde-Versuch (Magic-Link-Klick) im SQL Editor ausführen:
   ```sql
   update public.profiles set role = 'organizer' where email = 'deine@email.de';
   ```
5. Optional: Unter **Authentication → URL Configuration** die
   `Site URL` auf deine spätere Vercel-Domain setzen, damit die
   Magic-Link-E-Mails korrekt verlinken.

### Twilio (SMS & WhatsApp)

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
4. Danach in Supabase unter **Authentication → URL Configuration** die
   `Site URL` und `Redirect URLs` auf die Vercel-Domain (`.../auth/callback`)
   aktualisieren.

## Projektstruktur

```
app/
  page.tsx                Marketing-/Landingpage
  dashboard/page.tsx       Organisator-Dashboard (geschützt)
  respond/[token]/page.tsx Öffentliche Annahme/Ablehnung-Seite
  auth/callback/route.ts   Magic-Link Callback
  api/register/route.ts    Öffentliche Registrierung
  api/assign-task/route.ts Aufgabe zuteilen + SMS/WhatsApp senden
  api/respond/route.ts     Rückmeldung verarbeiten + Organisator benachrichtigen
components/
  MarketingClient.tsx       Rendert die Landingpage + bindet marketing-script.ts ein
  DashboardClient.tsx       Interaktives Dashboard (Events/Tage/Aufgaben/Zuteilung)
  RespondForm.tsx           Annehmen/Ablehnen-Formular
lib/
  supabase/                Browser-, Server- und Admin-Client
  twilio.ts                 SMS/WhatsApp-Versand (mit Fallback)
  marketing-content.ts       Extrahiertes HTML der bisherigen Seite
  marketing-script.ts        Extrahierte Interaktivität (i18n, Demo, Auth)
supabase/schema.sql         Datenbankschema + Row-Level-Security
```

## Bekannte Grenzen (MVP)

- Neue Organisatoren werden manuell per SQL freigeschaltet (kein
  Self-Service-Upgrade), aus Sicherheitsgründen.
- Twilio-Trial-Konten können nur an verifizierte Nummern senden — für den
  echten Betrieb ist ein bezahltes Twilio-Konto nötig.
- WhatsApp erfordert entweder die Twilio-Sandbox (Empfänger müssen
  beitreten) oder eine freigeschaltete WhatsApp Business-Nummer.
