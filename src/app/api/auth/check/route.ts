import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    // Opprett Supabase-klient
    const supabase = await createServerClient();

    // Hent gjeldende bruker
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Du må være innlogget for å utføre denne handlingen" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { user: { id: user.id, email: user.email } },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Uventet feil i auth/check:", error);
    return NextResponse.json({ error: "Noe gikk galt" }, { status: 500 });
  }
}
