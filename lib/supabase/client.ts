import { createBrowserClient } from "@supabase/ssr";

// Hinweis: bewusst ohne generisches Database-Typparameter, da die
// @supabase/supabase-js v2 Typsignatur ein exaktes GenericSchema
// (inkl. Views/Functions/Enums/CompositeTypes) erwartet. types/database.ts
// dient als Referenz-Dokumentation der Tabellenstruktur.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
