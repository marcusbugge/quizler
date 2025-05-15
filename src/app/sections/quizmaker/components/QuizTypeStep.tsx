import React, { useState, useEffect, KeyboardEvent } from "react";
import { QuizType } from "@/types/quiz";
import Image from "next/image";
import { QuizService } from "../services/quizService";
import QuizPreviewStep from "./QuizPreviewStep";
import GenerateButton from "./GenerateButton";
import { SporsmalData } from "../models/types";

interface QuizTypeStepProps {
  onNext: () => void;
  quizType: string;
  setQuizType: (type: string) => void;
  prompt: string;
}

// Definer typer for vanskelighetsgrad (valgfritt, men god praksis)
type Vanskelighetsgrad =
  | "lett"
  | "middels"
  | "vanskelig"
  | "ekspert"
  | "umulig"
  | "ekstrem";

const QuizTypeStep: React.FC<QuizTypeStepProps> = ({
  onNext,
  quizType,
  setQuizType,
  prompt,
}) => {
  const [randomBg, setRandomBg] = useState<string>("/bg1.png");
  const [isCreating, setIsCreating] = useState(false);
  // Ny state for valg
  const [valgtAntallSporsmal, setValgtAntallSporsmal] = useState<number>(5);
  const [valgtVanskelighetsgrad, setValgtVanskelighetsgrad] =
    useState<Vanskelighetsgrad>("middels");
  // Nye states for forhåndsvisning
  const [visFoerhandsvisning, setVisFoerhandsvisning] =
    useState<boolean>(false);
  const [generertQuiz, setGenerertQuiz] = useState<SporsmalData[]>([]);

  useEffect(() => {
    const bgNumber = Math.floor(Math.random() * 6) + 1;
    setRandomBg(`/bg${bgNumber}.png`);
  }, []);

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && quizType) {
      onNext();
    }
  };

  const handleCreateQuiz = async () => {
    setIsCreating(true);

    try {
      console.log("Starter quiz-opprettelse...");
      console.log("Prompt:", prompt);
      console.log("Quiz type:", quizType);

      // Konverter quizType fra UI-format til enum-format
      const apiQuizType = (() => {
        switch (quizType) {
          case "multiple-choice":
            return QuizType.MULTIPLE_CHOICE;
          case "read-aloud":
            return QuizType.HOYTLESNING;
          case "flashcards":
            return QuizType.FLASHCARDS;
          case "true-false":
            return QuizType.TRUE_FALSE;
          case "guess-the-year":
            return QuizType.GUESS_THE_YEAR;
          default:
            return QuizType.HOYTLESNING; // Fallback til høytlesning
        }
      })();

      console.log("API quizType:", apiQuizType);

      // Generer quiz gjennom service med valgte verdier
      const resultat = await QuizService.genererQuiz({
        prompt,
        quizType: apiQuizType,
        antallSporsmal: valgtAntallSporsmal, // Bruk state
        vanskelighetsgrad: valgtVanskelighetsgrad, // Bruk state
      });

      console.log("Mottok resultat fra genererQuiz:", resultat);

      if (resultat?.sporsmal?.length > 0) {
        console.log("Spørsmål mottatt, viser forhåndsvisning...");

        // Lagre spørsmålene i state
        setGenerertQuiz(resultat.sporsmal);

        // Vis forhåndsvisning
        setVisFoerhandsvisning(true);
      } else {
        throw new Error("Ingen spørsmål returnert fra API");
      }
    } catch (error: unknown) {
      console.error("Feil ved opprettelse av quiz:", error);
      alert(
        "Noe gikk galt ved opprettelse av quiz: " +
          ((error as Error).message || "Ukjent feil")
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleLagreQuiz = async () => {
    setIsCreating(true);

    try {
      console.log("Lagrer quiz etter forhåndsvisning...");

      // Konverter quizType fra UI-format til enum-format
      const apiQuizType = (() => {
        switch (quizType) {
          case "multiple-choice":
            return QuizType.MULTIPLE_CHOICE;
          case "read-aloud":
            return QuizType.HOYTLESNING;
          case "flashcards":
            return QuizType.FLASHCARDS;
          case "true-false":
            return QuizType.TRUE_FALSE;
          case "guess-the-year":
            return QuizType.GUESS_THE_YEAR;
          default:
            return QuizType.HOYTLESNING; // Fallback til høytlesning
        }
      })();

      // Lagre quizzen gjennom service
      try {
        const lagreResult = await QuizService.lagreQuiz({
          tittel: prompt,
          quiz_type: apiQuizType,
          sporsmal: generertQuiz,
          antall_sporsmal: valgtAntallSporsmal,
          vanskelighetsgrad: valgtVanskelighetsgrad,
          bakgrunnsbilde: randomBg, // Bruker det tilfeldig valgte bildet
        });

        if (lagreResult) {
          // Lagre quizzen i sessionStorage for å hente den på resultat-siden
          sessionStorage.setItem(
            "generertQuiz",
            JSON.stringify({ sporsmal: generertQuiz })
          );
          sessionStorage.setItem("quizTema", prompt);

          // Vis melding til brukeren
          alert("Quiz er opprettet og lagret!");

          // Naviger til resultat-siden
          console.log("Navigerer til resultat-siden...");
          window.location.href = "/quiz-result";
        }
      } catch (apiError: unknown) {
        console.error("API-feil:", apiError);

        // Sjekk om feilen er relatert til autentisering
        if (
          apiError instanceof Error &&
          apiError.message.includes("innlogget")
        ) {
          alert(
            "Du må være innlogget for å lagre quiz. Quiz blir generert, men ikke lagret."
          );

          // Lagre quizzen i sessionStorage men ikke i databasen
          sessionStorage.setItem(
            "generertQuiz",
            JSON.stringify({ sporsmal: generertQuiz })
          );
          sessionStorage.setItem("quizTema", prompt);

          // Naviger til resultat-siden
          window.location.href = "/quiz-result";
          return;
        }

        throw apiError;
      }
    } catch (error: unknown) {
      console.error("Feil ved lagring av quiz:", error);
      alert(
        "Noe gikk galt ved lagring av quiz: " +
          ((error as Error).message || "Ukjent feil")
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleTilbake = () => {
    setVisFoerhandsvisning(false);
    setGenerertQuiz([]);
  };

  // Hvis vi viser forhåndsvisning, vis den i stedet for det vanlige innholdet
  if (visFoerhandsvisning && generertQuiz.length > 0) {
    return (
      <QuizPreviewStep
        sporsmal={generertQuiz}
        prompt={prompt}
        quizType={quizType}
        onConfirm={handleLagreQuiz}
        onCancel={handleTilbake}
        vanskelighetsgrad={valgtVanskelighetsgrad}
        antallSporsmal={valgtAntallSporsmal}
      />
    );
  }

  return (
    <div className="quiz-step" onKeyPress={handleKeyPress} tabIndex={0}>
      <div className="quiz-editer-container">
        <div className="quiz-prompt-container">
          <h1 className="quiz-prompt-title">Din quiz</h1>
        </div>
        <div className="ditt-prompt">
          <div className="quiz-banner">
            <Image src={randomBg} alt="Quiz banner" width={250} height={160} />
          </div>
          <div className="sporsmal-options">
            <h1 className="quiz-sporsmal-title">Vanskelighetsgrad</h1>
            <button
              className={`sporsmal ${
                valgtVanskelighetsgrad === "lett" ? "selected" : ""
              }`}
              onClick={() => setValgtVanskelighetsgrad("lett")}
            >
              😴
            </button>
            <button
              className={`sporsmal ${
                valgtVanskelighetsgrad === "middels" ? "selected" : ""
              }`}
              onClick={() => setValgtVanskelighetsgrad("middels")}
            >
              😀
            </button>
            <button
              className={`sporsmal ${
                valgtVanskelighetsgrad === "vanskelig" ? "selected" : ""
              }`}
              onClick={() => setValgtVanskelighetsgrad("vanskelig")}
            >
              😮
            </button>
            <button
              className={`sporsmal ${
                valgtVanskelighetsgrad === "ekspert" ? "selected" : ""
              }`}
              onClick={() => setValgtVanskelighetsgrad("ekspert")}
            >
              💪
            </button>
            <button
              className={`sporsmal ${
                valgtVanskelighetsgrad === "umulig" ? "selected" : ""
              }`}
              onClick={() => setValgtVanskelighetsgrad("umulig")}
            >
              😰
            </button>
            <button
              className={`sporsmal ${
                valgtVanskelighetsgrad === "ekstrem" ? "selected" : ""
              }`}
              onClick={() => setValgtVanskelighetsgrad("ekstrem")}
            >
              🥵
            </button>
          </div>
          <div className="sporsmal-options">
            <h1 className="quiz-sporsmal-title">Antall spørsmål</h1>
            <button
              className={`sporsmal-button ${
                valgtAntallSporsmal === 5 ? "selected" : ""
              }`}
              onClick={() => setValgtAntallSporsmal(5)}
            >
              5
            </button>
            <button
              className={`sporsmal-button ${
                valgtAntallSporsmal === 10 ? "selected" : ""
              }`}
              onClick={() => setValgtAntallSporsmal(10)}
            >
              10
            </button>
            <button
              className={`sporsmal-button ${
                valgtAntallSporsmal === 15 ? "selected" : ""
              }`}
              onClick={() => setValgtAntallSporsmal(15)}
            >
              15
            </button>
            <button
              className={`sporsmal-button ${
                valgtAntallSporsmal === 20 ? "selected" : ""
              }`}
              onClick={() => setValgtAntallSporsmal(20)}
            >
              20
            </button>
          </div>
        </div>

        <div className="quiz-type">
          <h1>Quiz-type</h1>
          <div className="quiz-type-options">
            <button
              className={`quiz-type-button ${
                quizType === "multiple-choice" ? "selected" : ""
              }`}
              onClick={() => setQuizType("multiple-choice")}
            >
              Multiple Choice
            </button>
            <button
              className={`quiz-type-button ${
                quizType === "read-aloud" ? "selected" : ""
              }`}
              onClick={() => setQuizType("read-aloud")}
            >
              Spørsmål og svar
            </button>
            <button
              className={`quiz-type-button ${
                quizType === "flashcards" ? "selected" : ""
              }`}
              onClick={() => setQuizType("flashcards")}
            >
              Flashcards
            </button>
            <button
              className={`quiz-type-button ${
                quizType === "true-false" ? "selected" : ""
              }`}
              onClick={() => setQuizType("true-false")}
            >
              Sann/Usann
            </button>
            <button
              className={`quiz-type-button ${
                quizType === "guess-the-year" ? "selected" : ""
              }`}
              onClick={() => setQuizType("guess-the-year")}
            >
              Gjett året
            </button>
          </div>
        </div>
        <div className="quiz-create">
          <div className="prompt">
            <h1>Ditt prompt</h1>
            <p>{prompt}</p>
          </div>
          <GenerateButton
            onClick={handleCreateQuiz}
            isCreating={isCreating}
            isDisabled={!quizType || !prompt}
            text="Generer"
            loadingText="Genererer..."
          />
        </div>
      </div>
    </div>
  );
};

export default QuizTypeStep;
