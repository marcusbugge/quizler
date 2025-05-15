import { NextResponse, NextRequest } from "next/server";
import { QuizService } from "@/services/QuizService";

// Merk: Denne ruten er offentlig tilgjengelig per nå.
// Vurder å legge til autentisering/autorisasjon hvis nødvendig.
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Hent id fra params utenfor try/catch
  const quizId = params.id;
  if (!quizId) {
    // Burde teknisk sett ikke skje pga. ruten, men greit å sjekke
    return NextResponse.json({ error: "Missing quiz ID" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const sortByParam = searchParams.get("sortBy") as
    | "score"
    | "completed_at"
    | null;
  const orderParam = searchParams.get("order"); // "asc" eller "desc"

  const sortBy = sortByParam === "score" ? "score" : "completed_at"; // Default til completed_at
  // Default til descending for score, ascending for completed_at hvis order ikke er spesifisert
  const ascending =
    orderParam === "asc"
      ? true
      : orderParam === "desc"
      ? false
      : sortBy !== "score";

  // Enkel validering for limit
  if (
    limitParam &&
    (isNaN(parseInt(limitParam, 10)) || parseInt(limitParam, 10) <= 0)
  ) {
    return NextResponse.json(
      { error: "Invalid limit parameter" },
      { status: 400 }
    );
  }

  // Konverter limit etter validering for å unngå NaN-problemer senere
  const validatedLimit = limitParam ? parseInt(limitParam, 10) : undefined;

  // Validering for sortBy (selv om type cast hjelper)
  if (sortByParam && !["score", "completed_at"].includes(sortByParam)) {
    return NextResponse.json(
      { error: "Invalid sortBy parameter" },
      { status: 400 }
    );
  }

  try {
    // Bruk quizId-variabelen her
    const completions = await QuizService.getCompletionsByQuiz(quizId, {
      limit: validatedLimit,
      sortBy,
      ascending,
    });
    return NextResponse.json({ completions });
  } catch (error: unknown) {
    // Bruk quizId-variabelen i logging
    console.error(`API Error getting completions for quiz ${quizId}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch completions";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
