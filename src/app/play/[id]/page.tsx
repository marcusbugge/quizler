"use client";

import React, { useEffect, useState } from "react";
import { QuizProvider, useQuiz } from "../../../contexts/QuizContext";
import { QuizRendererFactory } from "../../../components/quiz-renderers/QuizRendererFactory";
import {
  QuizProgressBar,
  QuizCompletedView,
} from "../../../components/quiz-renderers/BaseQuizRenderer";
import { Quiz, QuizType } from "../../../types/quiz";
import "../style.scss";

// Interface for API Quiz
interface ApiQuiz {
  id: string;
  tittel: string;
  dato: string;
  quiz_type: string;
  sporsmal: ApiQuizSporsmal[];
}

// Interface for API Quiz Spørsmål
interface ApiQuizSporsmal {
  id: string;
  sporsmal: string;
  alternativer?: string[];
  riktigIndex?: number;
  svar?: string;
}

// Hjelpefunksjon for å konvertere API-quiz til intern format
const mapApiQuizToInternalQuiz = (apiQuiz: ApiQuiz): Quiz => {
  const quizType = apiQuiz.quiz_type as unknown as QuizType;

  const sporsmal = apiQuiz.sporsmal.map((s) => {
    if (apiQuiz.quiz_type === QuizType.MULTIPLE_CHOICE) {
      return {
        id: s.id,
        sporsmal: s.sporsmal,
        quizType: QuizType.MULTIPLE_CHOICE as const,
        alternativer: s.alternativer || [],
        riktigIndex: typeof s.riktigIndex === "number" ? s.riktigIndex : 0,
      };
    } else if (apiQuiz.quiz_type === QuizType.HOYTLESNING) {
      return {
        id: s.id,
        sporsmal: s.sporsmal,
        quizType: QuizType.HOYTLESNING as const,
        svar: s.svar || "",
      };
    } else {
      console.warn(`Ukjent quiz-type mottatt: ${apiQuiz.quiz_type}`);
      return {
        id: s.id,
        sporsmal: s.sporsmal,
        quizType: QuizType.MULTIPLE_CHOICE as const,
        alternativer: [],
        riktigIndex: 0,
      };
    }
  });

  return {
    id: apiQuiz.id,
    tittel: apiQuiz.tittel,
    dato: apiQuiz.dato,
    quizType,
    sporsmal: sporsmal,
  };
};

// Komponent som viser selve quizzen
const QuizPlayer = ({ params }: { params: Promise<{ id: string }> }) => {
  const { quiz, setQuiz, currentQuestion, submitAnswer, isCompleted } =
    useQuiz();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hent quiz data basert på ID
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const response = await fetch(`/api/quizzes/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error("Kunne ikke finne quizzen");
        }
        const data = await response.json();
        const mappedQuiz = mapApiQuizToInternalQuiz(data.quiz);
        setQuiz(mappedQuiz);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("En ukjent feil oppstod");
        }
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params, setQuiz]);

  if (loading) {
    return <div className="quiz-loading">Laster quiz...</div>;
  }

  if (error) {
    return <div className="quiz-error">{error}</div>;
  }

  if (!quiz) {
    return <div className="quiz-not-found">Quiz ikke funnet</div>;
  }

  if (isCompleted) {
    return <QuizCompletedView quizId={quiz.id} />;
  }

  return (
    <div className="quiz-player">
      <QuizProgressBar />

      <div className="quiz-container">
        <QuizRendererFactory
          sporsmal={quiz.sporsmal[currentQuestion]}
          onAnswer={submitAnswer}
        />
      </div>
    </div>
  );
};

// Hovedkomponent som setter opp konteksten
export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <QuizProvider>
      <div className="quiz-page-container">
        <QuizPlayer params={params} />
      </div>
    </QuizProvider>
  );
}
