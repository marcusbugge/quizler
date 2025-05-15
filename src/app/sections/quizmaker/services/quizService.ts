import { genererQuiz } from "@/utils/openai";
import { QuizType } from "@/types/quiz";
import { SporsmalData } from "../models/types";

export interface QuizGenereringsRequest {
  prompt: string;
  quizType: QuizType;
  antallSporsmal?: number;
  vanskelighetsgrad?: string;
}

export interface QuizLagringsRequest {
  tittel: string;
  quiz_type: QuizType;
  sporsmal: SporsmalData[];
  antall_sporsmal?: number;
  vanskelighetsgrad?: string;
  bakgrunnsbilde?: string;
}

export interface QuizResponse {
  message?: string;
  quiz?: {
    id: string;
    user_id: string;
    tittel: string;
    dato: string;
    quiz_type: string;
    sporsmal: SporsmalData[];
    created_at: string;
  };
  error?: string;
}

export class QuizService {
  /**
   * Genererer en quiz basert på gitte parametere
   */
  static async genererQuiz(request: QuizGenereringsRequest) {
    try {
      console.log("Kaller genererQuiz-funksjonen...");

      const resultat = await genererQuiz(
        request.quizType,
        request.prompt,
        request.antallSporsmal || 5,
        request.vanskelighetsgrad || "middels"
      );

      return resultat;
    } catch (error) {
      console.error("Feil i QuizService.genererQuiz:", error);
      throw error;
    }
  }

  /**
   * Lagrer en quiz til Supabase
   */
  static async lagreQuiz(request: QuizLagringsRequest) {
    try {
      console.log("Lagrer quiz til API...", request);

      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include", // Viktig for å sende med cookies
      });

      const responseText = await response.text();
      let responseData: QuizResponse = {};

      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Kunne ikke parse respons som JSON:", e);
        throw new Error("Ugyldig respons fra server");
      }

      if (!response.ok) {
        const errorMessage = responseData?.error || "Kunne ikke lagre quiz";

        // Hvis brukeren ikke er autentisert, kast en spesifikk feil
        if (response.status === 401) {
          throw new Error("Bruker må være innlogget for å lagre quiz");
        }

        throw new Error(errorMessage);
      }

      return responseData;
    } catch (error) {
      console.error("Feil i QuizService.lagreQuiz:", error);
      throw error;
    }
  }
}
