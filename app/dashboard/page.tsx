import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
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
            Dieser Bereich ist nur für Organisatoren. Melde dich über die
            Startseite mit deiner E-Mail-Adresse an (Anmelde-Link).
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

  if (!profile || profile.role !== "organizer") {
    return (
      <div className="center-page">
        <div className="center-box">
          <img src="/logo.png" className="logo" alt="JugendConnect" />
          <h1>Zugang ausstehend</h1>
          <p>
            Du bist angemeldet als <strong>{user.email}</strong>, aber dein
            Konto ist noch nicht als Organisator freigeschaltet. Bitte wende
            dich an ein bestehendes Organisator-Team-Mitglied.
          </p>
          <Link href="/" className="btn btn-outline">
            Zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  const [{ data: profiles }, { data: events }] = await Promise.all([
    supabase.from("profiles").select("*").order("full_name"),
    supabase
      .from("events")
      .select("*, event_days(*, tasks(*))")
      .order("start_date", { ascending: false }),
  ]);

  return (
    <DashboardClient
      currentOrganizer={profile}
      initialProfiles={profiles ?? []}
      initialEvents={(events as any) ?? []}
    />
  );
}
