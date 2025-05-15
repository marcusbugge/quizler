import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET-endepunkt for å hente en spesifikk quiz basert på ID
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;

    // Sjekk at ID er angitt
    if (!id) {
      return NextResponse.json({ error: "Quiz-ID må angis" }, { status: 400 });
    }

    // Opprett Supabase-klient med service role (unngår cookie-problemer)
    const supabase = createServiceClient();

    // Hent quiz fra databasen
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Feil ved henting av quiz:", error);
      return NextResponse.json(
        { error: "Kunne ikke hente quiz fra databasen" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Quiz ikke funnet" }, { status: 404 });
    }

    // Returner quizzen
    return NextResponse.json({ quiz: data });
  } catch (error) {
    console.error("Feil ved henting av quiz:", error);
    return NextResponse.json(
      { error: "Noe gikk galt ved henting av quiz" },
      { status: 500 }
    );
  }
}

/**
 * DELETE-endepunkt for å slette en spesifikk quiz basert på ID
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;

    // Sjekk at ID er angitt
    if (!id) {
      return NextResponse.json({ error: "Quiz-ID må angis" }, { status: 400 });
    }

    // Opprett Supabase-klient med service role (unngår cookie-problemer)
    const supabase = createServiceClient();

    // Slett quiz fra databasen
    const { error } = await supabase.from("quizzes").delete().eq("id", id);

    if (error) {
      console.error("Feil ved sletting av quiz:", error);
      return NextResponse.json(
        { error: "Kunne ikke slette quiz fra databasen" },
        { status: 500 }
      );
    }

    // Returner bekreftelse
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feil ved sletting av quiz:", error);
    return NextResponse.json(
      { error: "Noe gikk galt ved sletting av quiz" },
      { status: 500 }
    );
  }
}

/**
 * PUT-endepunkt for å oppdatere en spesifikk quiz basert på ID
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;

    // Sjekk at ID er angitt
    if (!id) {
      return NextResponse.json({ error: "Quiz-ID må angis" }, { status: 400 });
    }

    // Hent data fra request body
    const { tittel, dato, quiz_type, sporsmal } = await request.json();

    // Opprett Supabase-klient med service role (unngår cookie-problemer)
    const supabase = createServiceClient();

    // Oppdater quiz i databasen
    const { data, error } = await supabase
      .from("quizzes")
      .update({
        tittel,
        dato,
        quiz_type,
        sporsmal,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Feil ved oppdatering av quiz:", error);
      return NextResponse.json(
        { error: "Kunne ikke oppdatere quiz i databasen" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Quiz ikke funnet" }, { status: 404 });
    }

    // Returner den oppdaterte quizzen
    return NextResponse.json({ quiz: data[0] });
  } catch (error) {
    console.error("Feil ved oppdatering av quiz:", error);
    return NextResponse.json(
      { error: "Noe gikk galt ved oppdatering av quiz" },
      { status: 500 }
    );
  }
}
