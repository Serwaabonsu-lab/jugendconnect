import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Fängt Supabase-E-Mail-Links ab (E-Mail-Bestätigung und Passwort-Reset).
// Tauscht den Code gegen eine Session und leitet danach weiter - standard-
// mäßig zur Programm-Übersicht, oder zum per "next" angegebenen Ziel
// (z.B. /auth/reset-password nach einem Passwort-Reset-Link).
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const safeNext = next && next.startsWith("/") ? next : "/programme";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user?.email) {
      // Profil nachträglich mit dem Auth-Konto verknüpfen, falls es per
      // supabase.auth.signUp() clientseitig noch nicht verknüpft wurde.
      const admin = createAdminClient();
      await admin
        .from("profiles")
        .update({ auth_user_id: data.user.id })
        .eq("email", data.user.email.toLowerCase());
    }
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
