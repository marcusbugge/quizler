import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";

// Felles konfigurasjon
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Service rolle nøkkel brukes kun i createServiceClient
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Browser-klient (klientsiden)
export const createBrowserClient = () => {
  return createClientComponentClient<Database>();
};

// Server-klient (serversiden) - må kun brukes i server components
export const createServerClient = async () => {
  // Dynamisk import for å unngå problemer i klient-komponenter
  const { createServerComponentClient } = await import(
    "@supabase/auth-helpers-nextjs"
  );
  const { cookies } = await import("next/headers");

  return createServerComponentClient<Database>({ cookies });
};

// Service role klient (administrative operasjoner)
export const createServiceClient = () => {
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY er ikke definert");
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey);
};
