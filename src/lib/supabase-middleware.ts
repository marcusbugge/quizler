// Import skal importeres direkte her, med require inline i funksjonen
import type { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Felles konfigurasjon
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Definer CookieOptions-typen lokalt for å unngå å importere fra @supabase/ssr
interface CookieOptions {
  name?: string;
  value?: string;
  maxAge?: number;
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

// Middleware-klient - CommonJS-krav
export const createMiddlewareClient = (
  req: NextRequest,
  res: NextResponse
): SupabaseClient<Database> => {
  // Vi bruker require her fordi det er vanskelig å få dynamisk import til å fungere i middleware
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const { createServerClient } = require("@supabase/ssr");

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        res.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        res.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });
};
