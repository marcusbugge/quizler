import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { QuizType } from "@/types/quiz";
import type { Database } from "@/types/database.types";

export async function POST(request: Request) {
  try {
    // Hent data fra request body
    const {
      tittel,
      dato,
      quiz_type,
      sporsmal,
      user_id,
      antall_sporsmal,
      vanskelighetsgrad,
      bakgrunnsbilde,
    } = await request.json();

    console.log("Mottatt data:", {
      tittel,
      dato,
      quiz_type,
      user_id,
      sporsmal: sporsmal?.length || 0,
      antall_sporsmal,
      vanskelighetsgrad,
      bakgrunnsbilde,
    });

    // Valider at tittel, quiz_type og sporsmal er angitt (dato og user_id kan mangle)
    if (!tittel || !quiz_type || !sporsmal) {
      return NextResponse.json(
        { error: "Tittel, quiz_type og sporsmal må angis" },
        { status: 400 }
      );
    }

    // Valider quiz_type
    if (!Object.values(QuizType).includes(quiz_type as QuizType)) {
      return NextResponse.json({ error: "Ugyldig quiz_type" }, { status: 400 });
    }

    // Sett dagens dato hvis den ikke er angitt
    const effektiv_dato = dato || new Date().toISOString().split("T")[0];

    // Bruk angitt user_id eller en anonym ID
    const effektiv_user_id = user_id || "anonym-" + uuidv4().substring(0, 8);

    // Hent miljøvariabler
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Sjekk om miljøvariabler er satt
    if (!supabaseUrl) {
      console.error("NEXT_PUBLIC_SUPABASE_URL er ikke definert");
      return NextResponse.json(
        { error: "Supabase URL er ikke konfigurert" },
        { status: 500 }
      );
    }

    // Velg nøkkel i prioritert rekkefølge: service key > anon key
    const authKey = supabaseServiceKey || supabaseAnonKey;
    if (!authKey) {
      console.error("Ingen Supabase-nøkkel er definert");
      return NextResponse.json(
        { error: "Supabase-nøkkel er ikke konfigurert" },
        { status: 500 }
      );
    }

    // Opprett Supabase-klient direkte
    const supabase = createClient<Database>(supabaseUrl, authKey);

    // Data som skal sendes til databasen
    const quizData = {
      id: uuidv4(),
      user_id: effektiv_user_id,
      tittel,
      dato: effektiv_dato,
      quiz_type,
      sporsmal,
      antall_sporsmal,
      vanskelighetsgrad,
      bakgrunnsbilde,
    };

    console.log("Prøver å lagre data:", quizData);

    // Opprett quiz i databasen
    const { data, error } = await supabase
      .from("quizzes")
      .insert(quizData)
      .select();

    if (error) {
      console.error("Feil ved lagring av quiz:", error);
      console.error("Feildetaljer:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: `Kunne ikke lagre quiz i databasen: ${
            error.message || error.code || "Ukjent feil"
          }`,
        },
        { status: 500 }
      );
    }

    // Returner den opprettede quizzen
    return NextResponse.json({ quiz: data[0] });
  } catch (error) {
    console.error("Feil ved opprettelse av quiz:", error);
    if (error instanceof Error) {
      console.error("Feilmelding:", error.message);
      console.error("Stack trace:", error.stack);
    }
    return NextResponse.json(
      { error: "Noe gikk galt ved opprettelse av quiz" },
      { status: 500 }
    );
  }
}
