import { NextResponse } from "next/server";
import OpenAI from "openai";
import { QuizType } from "@/types/quiz";

// Initialisering av OpenAI klienten
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Typen for uparset spørsmål-data fra OpenAI
interface UparsetSporsmal {
  sporsmal: string;
  quizType: QuizType;
  alternativer?: string[];
  riktigIndex?: number;
  svar?: string | boolean;
  begrunnelse?: string;
  beskrivelse?: string;
  riktigAar?: number;
}

export async function POST(request: Request) {
  try {
    // Hent data fra request body
    const { prompt, quizType, antallSporsmal, tema, vanskelighetsgrad } =
      await request.json();

    // Valider at nødvendige data er angitt
    if (!quizType || !antallSporsmal || !tema) {
      return NextResponse.json(
        { error: "Quiz-type, antall spørsmål og tema må spesifiseres" },
        { status: 400 }
      );
    }

    // Bygg prompt basert på quiz-type
    let systemPrompt = "";

    if (quizType === QuizType.MULTIPLE_CHOICE) {
      systemPrompt = `
        Du er en quiz-ekspert som lager gode multiple choice quiz-spørsmål.
        Lag ${antallSporsmal} multiple choice spørsmål om "${tema}" med ${
        vanskelighetsgrad || "middels"
      } vanskelighetsgrad.
        For hvert spørsmål, gi 4 svaralternativer og marker det riktige svaret.
        VIKTIG: Varier plasseringen av det riktige svaret. Ikke alltid ha det på samme posisjon. 
        Fordel riktig svar jevnt mellom posisjonene 0, 1, 2 og 3 for de ulike spørsmålene.
        
        Formater svarene som JSON i følgende format:
        {
          "quizType": "multiple_choice",
          "sporsmal": [
            {
              "sporsmal": "Spørsmålstekst",
              "alternativer": ["Alt 1", "Alt 2", "Alt 3", "Alt 4"],
              "riktigIndex": 0-3,
              "quizType": "multiple_choice"
            },
            ...
          ]
        }
        
        Sørg for at JSON-formateringen er korrekt slik at den kan parses direkte.
      `;
    } else if (quizType === QuizType.HOYTLESNING) {
      systemPrompt = `
        Du er en quiz-ekspert som lager gode høytlesnings-spørsmål.
        Lag ${antallSporsmal} høytlesningsspørsmål om "${tema}" med ${
        vanskelighetsgrad || "middels"
      } vanskelighetsgrad.
        For hvert spørsmål, gi et tydelig og konsist svar.
        
        Formater svarene som JSON i følgende format:
        {
          "quizType": "hoytlesning",
          "sporsmal": [
            {
              "sporsmal": "Spørsmålstekst",
              "svar": "Svartekst",
              "quizType": "hoytlesning"
            },
            ...
          ]
        }
        
        Sørg for at JSON-formateringen er korrekt slik at den kan parses direkte.
      `;
    } else if (quizType === QuizType.FLASHCARDS) {
      systemPrompt = `
        Du er en quiz-ekspert som lager gode flashcards.
        Lag ${antallSporsmal} flashcards om "${tema}" med ${
        vanskelighetsgrad || "middels"
      } vanskelighetsgrad.
        For hvert flashcard, gi et tydelig og konsist svar.
        
        Formater svarene som JSON i følgende format:
        {
          "quizType": "flashcards",
          "sporsmal": [
            {
              "sporsmal": "Spørsmål/term/begrep på forsiden",
              "svar": "Svar/definisjon/forklaring på baksiden",
              "quizType": "flashcards"
            },
            ...
          ]
        }
        
        Sørg for at JSON-formateringen er korrekt slik at den kan parses direkte.
      `;
    } else if (quizType === QuizType.TRUE_FALSE) {
      systemPrompt = `
        Du er en quiz-ekspert som lager gode sann/usann-spørsmål.
        Lag ${antallSporsmal} sann/usann-spørsmål om "${tema}" med ${
        vanskelighetsgrad || "middels"
      } vanskelighetsgrad.
        For hvert spørsmål, angi om påstanden er sann eller usann, og gi en kort begrunnelse.
        
        Formater svarene som JSON i følgende format:
        {
          "quizType": "true_false",
          "sporsmal": [
            {
              "sporsmal": "Påstand som skal vurderes som sann eller usann",
              "svar": true eller false,
              "begrunnelse": "Kort forklaring på hvorfor påstanden er sann eller usann",
              "quizType": "true_false"
            },
            ...
          ]
        }
        
        Sørg for at JSON-formateringen er korrekt slik at den kan parses direkte.
      `;
    } else if (quizType === QuizType.GUESS_THE_YEAR) {
      systemPrompt = `
        Du er en quiz-ekspert som lager gode gjett-året-spørsmål.
        Lag ${antallSporsmal} gjett-året-spørsmål om "${tema}" med ${
        vanskelighetsgrad || "middels"
      } vanskelighetsgrad.
        For hvert spørsmål, beskriv en historisk hendelse og angi det riktige årstallet.
        
        Formater svarene som JSON i følgende format:
        {
          "quizType": "guess_the_year",
          "sporsmal": [
            {
              "sporsmal": "Hvilken år skjedde denne hendelsen?",
              "beskrivelse": "Detaljert beskrivelse av hendelsen",
              "riktigAar": årstall (f.eks. 1945),
              "quizType": "guess_the_year"
            },
            ...
          ]
        }
        
        Sørg for at JSON-formateringen er korrekt slik at den kan parses direkte.
      `;
    } else {
      return NextResponse.json({ error: "Ugyldig quiz-type" }, { status: 400 });
    }

    // Send forespørsel til OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: prompt || `Lag en ${quizType} quiz om ${tema}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    // Hent svaret
    const responseText = completion.choices[0].message.content || "";

    // Forsøk å parse JSON
    try {
      // Finn JSON i svaret (i tilfelle AI legger til ekstra tekst)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("Kunne ikke finne gyldig JSON i svaret");
      }

      const quizData = JSON.parse(jsonMatch[0]);

      // Legg til ID for hvert spørsmål
      const sporsmalMedIds = quizData.sporsmal.map((s: UparsetSporsmal) => ({
        ...s,
        id: Math.random().toString(36).substring(2, 9),
      }));

      // Returner den ferdig formaterte quizzen
      return NextResponse.json({
        svar: {
          ...quizData,
          sporsmal: sporsmalMedIds,
        },
      });
    } catch (error) {
      console.error(
        "Feil ved parsing av JSON:",
        error,
        "Råtekst:",
        responseText
      );
      return NextResponse.json(
        {
          error: "Kunne ikke parse JSON fra AI-respons",
          rawResponse: responseText,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Feil ved kommunikasjon med OpenAI:", error);
    return NextResponse.json(
      { error: "Noe gikk galt ved kommunikasjon med OpenAI" },
      { status: 500 }
    );
  }
}
