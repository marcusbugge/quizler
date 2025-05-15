import { QuizType } from "@/types/quiz";

/**
 * Generer en quiz med OpenAI via API-ruten
 * @param quizType Type quiz som skal genereres
 * @param tema Temaet for quizzen
 * @param antallSporsmal Antall spørsmål som skal genereres
 * @param vanskelighetsgrad Vanskelighetsgrad for spørsmålene
 * @param prompt Valgfri tilleggsprompt som sendes til AI
 * @returns Generert quiz-data
 */
export async function genererQuiz(
  quizType: QuizType,
  tema: string,
  antallSporsmal: number = 5,
  vanskelighetsgrad: string = "middels",
  prompt?: string
) {
  try {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quizType,
        tema,
        antallSporsmal,
        vanskelighetsgrad,
        prompt,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Noe gikk galt ved kommunikasjon med API");
    }

    const data = await response.json();
    return data.svar;
  } catch (error) {
    console.error("Feil ved generering av quiz:", error);
    throw error;
  }
}

/**
 * Enkel funksjon for å sende en tekstspørring til OpenAI via vår egen API-rute
 * @param prompt Spørringen som sendes til OpenAI
 * @returns Responsen fra API-et
 */
export async function sendPromptToOpenAI(prompt: string) {
  try {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        quizType: QuizType.MULTIPLE_CHOICE, // Standard quiz-type
        tema: "Generelt",
        antallSporsmal: 1,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Noe gikk galt ved kommunikasjon med API");
    }

    const data = await response.json();
    return data.svar;
  } catch (error) {
    console.error("Feil ved spørring til OpenAI:", error);
    throw error;
  }
}

/**
 * Eksempel på bruk av funksjonen
 */
export async function eksempel() {
  try {
    const quiz = await genererQuiz(
      QuizType.MULTIPLE_CHOICE,
      "Norges geografi",
      3,
      "lett"
    );
    console.log("Quiz generert:", quiz);
  } catch (error) {
    console.error("Noe gikk galt:", error);
  }
}
