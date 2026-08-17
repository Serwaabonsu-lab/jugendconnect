import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client. NEVER import this from client components or
// anything that ships to the browser — it bypasses Row Level Security.
// Only use it inside Route Handlers (app/api/**/route.ts).
// Hinweis: bewusst ohne generisches Database-Typparameter, siehe
// lib/supabase/client.ts.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase Admin-Client fehlt: NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY nicht gesetzt."
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
