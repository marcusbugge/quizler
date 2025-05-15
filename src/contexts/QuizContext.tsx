import React, { createContext, useContext, useState, ReactNode } from "react";
import { Quiz, isMultipleChoice, isHoytlesning } from "../types/quiz";

interface QuizContextType {
  quiz: Quiz | null;
  setQuiz: (quiz: Quiz) => void;
  currentQuestion: number;
  setCurrentQuestion: (index: number) => void;
  answers: (string | number)[];
  setAnswers: (answers: (string | number)[]) => void;
  submitAnswer: (answer: string | number) => void;
  isCompleted: boolean;
  score: number;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Funksjon for å sende inn fullføringslogg til API
  const recordCompletionApi = async (quizId: string, finalScore: number) => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score: finalScore }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error logging completion:", errorData.error);
        // Her kan du vurdere å vise en feilmelding til brukeren
      }
    } catch (error) {
      console.error("Network error logging completion:", error);
      // Her kan du også vurdere feilhåndtering mot brukeren
    }
  };

  // Tilbake til synkron submitAnswer
  const submitAnswer = (answer: string | number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    // Om dette er det siste spørsmålet, beregn score, logg i bakgrunnen og merk som ferdig
    if (quiz && currentQuestion === quiz.sporsmal.length - 1) {
      const finalScore = calculateScore(newAnswers); // Få score tilbake
      // Kall API for å logge fullføringen (uten await)
      recordCompletionApi(quiz.id, finalScore).catch((error) => {
        // Logg feil ved bakgrunnslogging, men ikke blokker UI
        console.error("Bakgrunnsfeil ved logging av quiz-fullføring:", error);
      });
      setIsCompleted(true); // Sett ferdig umiddelbart
    } else {
      // Gå til neste spørsmål
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const calculateScore = (_finalAnswers: (string | number)[]): number => {
    if (!quiz) return 0; // Returner 0 hvis ingen quiz

    let correctAnswers = 0;

    console.log("DEBUG: Alle svar som er gitt:", _finalAnswers);

    // Sjekk hvert svar mot riktig svar
    _finalAnswers.forEach((svar, index) => {
      const sporsmal = quiz.sporsmal[index];

      if (isMultipleChoice(sporsmal)) {
        // For multiple choice, sjekk om brukerens svar (index) matcher riktigIndex
        console.log(`DEBUG: Spørsmål ${index + 1}:`, {
          sporsmal: sporsmal.sporsmal,
          gittSvar: svar,
          riktigIndex: sporsmal.riktigIndex,
          erRiktig: svar === sporsmal.riktigIndex,
        });

        if (svar === sporsmal.riktigIndex) {
          correctAnswers += 1;
        }
      } else if (isHoytlesning(sporsmal)) {
        // For høytlesning (eller andre fremtidige typer) kan vi implementere spesifikk logikk
        // Her kan man legge til logikk for å sammenligne svar for høytlesning
      }
    });

    console.log("DEBUG: Totalt antall riktige svar:", correctAnswers);

    setScore(correctAnswers);
    return correctAnswers;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsCompleted(false);
    setScore(0);
  };

  return (
    <QuizContext.Provider
      value={{
        quiz,
        setQuiz,
        currentQuestion,
        setCurrentQuestion,
        answers,
        setAnswers,
        submitAnswer,
        isCompleted,
        score,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz må brukes innenfor en QuizProvider");
  }
  return context;
};
