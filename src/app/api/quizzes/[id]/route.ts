import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET-endepunkt som videresender til /api/quiz/[id]
 * for å sikre bakoverkompatibilitet med eksisterende frontend-kode
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;

    // Videresend til /api/quiz/[id]
    const response = await fetch(new URL(`/api/quiz/${id}`, request.url), {
      method: "GET",
      headers: request.headers,
    });

    // Returner svaret fra quiz/[id]
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Feil ved videresending til quiz/[id]:", error);
    return NextResponse.json(
      { error: "Noe gikk galt ved henting av quiz" },
      { status: 500 }
    );
  }
}

/**
 * PUT-endepunkt som videresender til /api/quiz/[id]
 * for å sikre bakoverkompatibilitet med eksisterende frontend-kode
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;

    // Videresend til /api/quiz/[id]
    const response = await fetch(new URL(`/api/quiz/${id}`, request.url), {
      method: "PUT",
      headers: request.headers,
      body: await request.text(),
    });

    // Returner svaret fra quiz/[id]
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Feil ved videresending til quiz/[id]:", error);
    return NextResponse.json(
      { error: "Noe gikk galt ved oppdatering av quiz" },
      { status: 500 }
    );
  }
}

/**
 * DELETE-endepunkt som videresender til /api/quiz/[id]
 * for å sikre bakoverkompatibilitet med eksisterende frontend-kode
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;

    // Videresend til /api/quiz/[id]
    const response = await fetch(new URL(`/api/quiz/${id}`, request.url), {
      method: "DELETE",
      headers: request.headers,
    });

    // Returner svaret fra quiz/[id]
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Feil ved videresending til quiz/[id]:", error);
    return NextResponse.json(
      { error: "Noe gikk galt ved sletting av quiz" },
      { status: 500 }
    );
  }
}
