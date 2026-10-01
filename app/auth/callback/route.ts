import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Fängt Supabase-E-Mail-Bestätigungslinks ab (z.B. falls "Confirm email"
// im Supabase-Projekt aktiviert ist). Tauscht den Code gegen eine Session
// und leitet danach zur Programm-Übersicht weiter.
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");

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

  return NextResponse.redirect(`${origin}/programme`);
}
