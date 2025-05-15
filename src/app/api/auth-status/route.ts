import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      authenticated: !!data.session,
      sessionExpires: data.session?.expires_at,
    });
  } catch (error: unknown) {
    console.error("Feil i auth-status:", error);
    return NextResponse.json({ error: "Intern serverfeil" }, { status: 500 });
  }
}
