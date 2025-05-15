import { Quiz, QuizType, MultipleChoiceSporsmal } from "../types/quiz";
import { createServiceClient } from "../lib/supabase";

// Dette er en service som bruker samme API som resten av appen

interface ApiQuizSporsmal {
  id: string;
  sporsmal: string;
  alternativer?: string[];
  riktig_index?: number;
  svar?: string;
}

interface ApiQuiz {
  id: string;
  tittel: string;
  dato: string;
  quiz_type: string;
  bakgrunnsbilde?: string;
  antall_sporsmal: number;
  vanskelighetsgrad?: string;
  sporsmal: ApiQuizSporsmal[];
}

// Konverterer API-responsen til vår interne Quiz-type
const mapApiToQuiz = (apiQuiz: ApiQuiz): Quiz => {
  // Her må vi justere typen basert på det som kommer fra API
  const quizType = apiQuiz.quiz_type as unknown as QuizType;

  // Mapper spørsmål til riktig format basert på quiz-type
  const sporsmal =
    apiQuiz.sporsmal?.map((s) => {
      if (apiQuiz.quiz_type === "multiple_choice") {
        return {
          id: s.id,
          sporsmal: s.sporsmal,
          quizType: QuizType.MULTIPLE_CHOICE as const,
          alternativer: s.alternativer || [],
          riktigIndex: typeof s.riktig_index === "number" ? s.riktig_index : 0,
        };
      } else if (apiQuiz.quiz_type === "hoytlesning") {
        return {
          id: s.id,
          sporsmal: s.sporsmal,
          quizType: QuizType.HOYTLESNING as const,
          svar: s.svar || "",
        };
      } else {
        // Fallback for andre typer - returnere et generisk spørsmål
        // Dette er nødvendig for typesikkerhet selv om det sjelden skjer
        return {
          id: s.id,
          sporsmal: s.sporsmal,
          quizType: QuizType.MULTIPLE_CHOICE as const, // Bruker MULTIPLE_CHOICE som standard
          alternativer: [""], // Tom liste med alternativer
          riktigIndex: 0,
        } as MultipleChoiceSporsmal; // Bruk spesifikk type-cast
      }
    }) || [];

  return {
    id: apiQuiz.id,
    tittel: apiQuiz.tittel,
    dato: apiQuiz.dato,
    quizType: quizType,
    sporsmal: sporsmal,
  };
};

export const QuizService = {
  /**
   * Hent en quiz basert på ID
   */
  getQuiz: async (id: string): Promise<Quiz> => {
    try {
      const response = await fetch(`/api/quizzes/${id}`);
      if (!response.ok) {
        throw new Error(`Quiz med ID ${id} finnes ikke`);
      }
      const data = await response.json();
      return mapApiToQuiz(data.quiz);
    } catch (error) {
      console.error("Feil ved henting av quiz:", error);
      throw error;
    }
  },

  /**
   * Hent bare quiz-typen for en gitt quiz
   */
  getQuizType: async (id: string): Promise<QuizType> => {
    try {
      const response = await fetch(`/api/quizzes/${id}`);
      if (!response.ok) {
        throw new Error(`Quiz med ID ${id} finnes ikke`);
      }
      const data = await response.json();
      return data.quiz.quiz_type as unknown as QuizType;
    } catch (error) {
      console.error("Feil ved henting av quiz-type:", error);
      throw error;
    }
  },

  /**
   * Hent en liste med alle tilgjengelige quizzer
   */
  getAllQuizzes: async (): Promise<Quiz[]> => {
    try {
      const response = await fetch("/api/quizzes");
      if (!response.ok) {
        throw new Error("Kunne ikke hente quizzer");
      }
      const data = await response.json();
      return data.quizzes.map(mapApiToQuiz);
    } catch (error) {
      console.error("Feil ved henting av quizzer:", error);
      throw error;
    }
  },

  /**
   * Registrerer at en bruker har fullført en quiz.
   * Kalles fra server-siden (API-rute, Server Action).
   */
  recordCompletion: async (
    userId: string,
    quizId: string,
    score: number | null
  ): Promise<void> => {
    const supabase = createServiceClient();
    const { error } = await supabase.from("quiz_completions").insert({
      user_id: userId,
      quiz_id: quizId,
      score: score,
    });

    if (error) {
      console.error("Feil ved logging av quiz-fullføring:", error);
      throw new Error("Kunne ikke logge quiz-fullføring.");
    }
    console.log(`Bruker ${userId} fullførte quiz ${quizId}`);
  },

  /**
   * Henter alle fullføringer for en spesifikk bruker.
   * Kalles fra server-siden.
   */
  getCompletionsByUser: async (userId: string) => {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("quiz_completions")
      .select("*, quizzes(tittel)") // Henter også quiz-tittel
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (error) {
      console.error("Feil ved henting av brukerens fullføringer:", error);
      throw new Error("Kunne ikke hente brukerens fullføringer.");
    }
    return data;
  },

  /**
   * Henter alle fullføringer for en spesifikk quiz, inkludert brukerinfo.
   * Støtter sortering og begrensning for leaderboard.
   * Kalles fra server-siden.
   */
  getCompletionsByQuiz: async (
    quizId: string,
    options?: {
      limit?: number;
      sortBy?: "score" | "completed_at";
      ascending?: boolean;
    }
  ) => {
    const supabase = createServiceClient();
    const limit = options?.limit;
    const sortBy = options?.sortBy ?? "completed_at"; // Standard sortering
    const ascending = options?.ascending ?? (sortBy === "score" ? false : true); // score synkende, dato stigende

    // Går tilbake til å joine med profiles-tabellen
    let query = supabase
      .from("quiz_completions")
      .select(
        `
        completed_at,
        score,
        profiles ( username, avatar_url ) 
      `
      )
      .eq("quiz_id", quizId)
      .order(sortBy, { ascending: ascending });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Feil ved henting av quiz-fullføringer:", error);
      throw new Error("Kunne ikke hente quiz-fullføringer.");
    }

    // Transformerer data for å få en flatere struktur om ønskelig
    // return data.map(d => ({ ...d, ...d.profiles }));
    return data;
  },
};
