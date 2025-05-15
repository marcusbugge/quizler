"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QuizType } from "../../../types/quiz";
import "../style.scss";

interface QuizLayoutProps {
  children: ReactNode;
}

const getLayoutClassForQuizType = (quizType: string | undefined): string => {
  if (!quizType) return "default-quiz-layout";

  switch (quizType) {
    case QuizType.MULTIPLE_CHOICE:
    case "multiple_choice":
      return "multiple-choice-layout";
    case QuizType.HOYTLESNING:
    case "hoytlesning":
      return "hoytlesning-layout";
    case QuizType.FLASHCARDS:
    case "flashcards":
      return "flashcards-layout";
    case QuizType.TRUE_FALSE:
    case "true_false":
      return "true-false-layout";
    case QuizType.GUESS_THE_YEAR:
    case "guess_the_year":
      return "guess-the-year-layout";
    default:
      return "default-quiz-layout";
  }
};

export default function QuizLayout({ children }: QuizLayoutProps) {
  const params = useParams();
  const [quizType, setQuizType] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizType = async () => {
      if (params.id) {
        try {
          const response = await fetch(`/api/quizzes/${params.id}`);
          if (!response.ok) {
            throw new Error("Kunne ikke finne quizzen");
          }
          const data = await response.json();
          setQuizType(data.quiz.quiz_type);
        } catch (error) {
          console.error("Feil ved henting av quiz-type:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuizType();
  }, [params.id]);

  const layoutClass = getLayoutClassForQuizType(quizType);

  if (loading) {
    return <div>Laster...</div>;
  }

  return <div className={`quiz-layout ${layoutClass}`}>{children}</div>;
}
