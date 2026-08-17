import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  let body: {
    fullName?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const fullName = (body.fullName || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const phone = (body.phone || "").trim();
  const birthDate = (body.birthDate || "").trim();

  if (!fullName || !email) {
    return NextResponse.json(
      { error: "Name und E-Mail-Adresse sind erforderlich." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Bitte gib eine gültige E-Mail-Adresse ein." },
      { status: 400 }
    );
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("profiles")
      .upsert(
        {
          full_name: fullName,
          email,
          phone: phone || null,
          birth_date: birthDate || null,
          role: "member",
        },
        { onConflict: "email", ignoreDuplicates: false }
      );

    if (error) {
      console.error("Registrierung fehlgeschlagen:", error);
      return NextResponse.json(
        { error: "Registrierung konnte nicht gespeichert werden." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Registrierung fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Server ist nicht korrekt konfiguriert (Supabase)." },
      { status: 500 }
    );
  }
}
