import { NextResponse } from "next/server";

/**
 * POST-endepunkt som videresender til /api/quiz/create
 * for å sikre bakoverkompatibilitet med eksisterende frontend-kode
 */
export async function POST(request: Request) {
  try {
    // Videresend til /api/quiz/create
    const response = await fetch(new URL("/api/quiz/create", request.url), {
      method: "POST",
      headers: request.headers,
      body: await request.text(),
    });

    // Returner svaret fra quiz/create
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Feil ved videresending til quiz/create:", error);
    return NextResponse.json(
      { error: "Noe gikk galt ved opprettelse av quiz" },
      { status: 500 }
    );
  }
}

/**
 * GET-endepunkt som videresender til /api/quiz
 * for å sikre bakoverkompatibilitet med eksisterende frontend-kode
 */
export async function GET(request: Request) {
  try {
    // Videresend til /api/quiz
    const response = await fetch(new URL("/api/quiz", request.url), {
      method: "GET",
      headers: request.headers,
    });

    // Returner svaret fra quiz
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Feil ved videresending til quiz:", error);
    return NextResponse.json(
      { error: "Noe gikk galt ved henting av quizzer" },
      { status: 500 }
    );
  }
}
