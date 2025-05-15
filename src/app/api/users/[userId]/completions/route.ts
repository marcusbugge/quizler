import { NextResponse } from "next/server";
import { QuizService } from "@/services/QuizService";
import { createServerClient } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  // Hent bruker fra session/token for å validere at forespørselen er gyldig
  // (eller bruk RLS i Supabase for å begrense tilgang)
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Enkel sjekk - ideelt sett bør kanskje bare admin eller brukeren selv hente dette?
  // Dette avhenger av din autorisasjonslogikk.
  if (!user /* || user.id !== params.userId */) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const completions = await QuizService.getCompletionsByUser(params.userId);
    return NextResponse.json({ completions });
  } catch (error: unknown) {
    console.error(
      `API Error getting completions for user ${params.userId}:`,
      error
    );
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch completions";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
