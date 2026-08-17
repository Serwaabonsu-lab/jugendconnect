"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { initMarketingScript } from "@/lib/marketing-script";
import { MARKETING_HTML } from "@/lib/marketing-content";

export default function MarketingClient() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const supabase = createClient();
    initMarketingScript(supabase);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: MARKETING_HTML }} />;
}
