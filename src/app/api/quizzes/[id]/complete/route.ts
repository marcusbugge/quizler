import { NextResponse } from "next/server";
import { QuizService } from "@/services/QuizService";
import { createServerClient } from "@/lib/supabase";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const quizId = params.id;
  if (!quizId) {
    return NextResponse.json({ error: "Missing quiz ID" }, { status: 400 });
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  let score: number | null = null;
  try {
    // Hent score fra request body
    const body = await request.json();
    if (typeof body.score === "number") {
      score = body.score;
    } else if (body.score !== undefined && body.score !== null) {
      // Hvis score er gitt, men ikke et tall, er det en feil.
      return NextResponse.json(
        { error: "Invalid score format" },
        { status: 400 }
      );
    }
    // Hvis score ikke er i body, forblir den null
  } catch {
    // Ignorer feil hvis body ikke er JSON eller mangler, score forblir null
    console.warn("Could not parse score from request body or body is empty.");
  }

  try {
    await QuizService.recordCompletion(user.id, quizId, score);
    return NextResponse.json({ message: "Quiz completion recorded" });
  } catch (error: unknown) {
    console.error(
      `API Error recording completion for quiz ${quizId} by user ${user.id}:`,
      error
    );
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to record quiz completion";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
