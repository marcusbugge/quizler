import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

/**
 * GET-endepunkt for å hente quizzer
 * Støtter filtrering på user_id som query parameter
 */
export async function GET(request: Request) {
  try {
    // Hent query parametere
    const url = new URL(request.url);
    const userId = url.searchParams.get("user_id");

    // Opprett Supabase-klient med service role (unngår cookie-problemer)
    const supabase = createServiceClient();

    // Bygg spørring
    let query = supabase.from("quizzes").select("*");

    // Filtrer på bruker-ID hvis angitt
    if (userId) {
      query = query.eq("user_id", userId);
    }

    // Utfør spørringen
    const { data, error } = await query;

    if (error) {
      console.error("Feil ved henting av quizzer:", error);
      return NextResponse.json(
        { error: "Kunne ikke hente quizzer fra databasen" },
        { status: 500 }
      );
    }

    // Returner quizzene
    return NextResponse.json({ quizzes: data });
  } catch (error) {
    console.error("Feil ved henting av quizzer:", error);
    return NextResponse.json(
      { error: "Noe gikk galt ved henting av quizzer" },
      { status: 500 }
    );
  }
}
