import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user?.email) {
      // Profil verlinken/anlegen, falls noch nicht vorhanden (z.B. erster
      // Login eines Organisators, der sich noch nie über das Formular
      // registriert hat).
      const admin = createAdminClient();
      await admin.from("profiles").upsert(
        {
          auth_user_id: data.user.id,
          email: data.user.email.toLowerCase(),
          full_name: data.user.email,
        },
        { onConflict: "email", ignoreDuplicates: false }
      );
      // auth_user_id nachträglich setzen, falls das Profil per /api/register
      // bereits ohne auth_user_id existierte.
      await admin
        .from("profiles")
        .update({ auth_user_id: data.user.id })
        .eq("email", data.user.email.toLowerCase());
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
