"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// Fallback bilde-URL
const FALLBACK_IMAGE = "/bg1.jpg";

export interface Quiz {
  id: string;
  tittel: string;
  dato: string;
  quiz_type: string;
  bakgrunnsbilde: string;
  antall_sporsmal: number;
  vanskelighetsgrad: string;
}

interface QuizListProps {
  onSelectQuiz: (quiz: Quiz | null) => void;
}

const QuizList: React.FC<QuizListProps> = ({ onSelectQuiz }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/quizzes");
        if (!response.ok) {
          throw new Error("Kunne ikke hente quizzer");
        }
        const data = await response.json();

        // Kombiner faktiske quizzer med dummy-data
        setQuizzes([...data.quizzes]);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("En ukjent feil oppstod");
        }
      }
    };

    fetchQuizzes();
  }, []);

  // Funksjon for å håndtere klikk på quiz-kort
  const handleQuizClick = (quiz: Quiz) => {
    onSelectQuiz(quiz);
  };

  if (error) {
    return <div>Feil: {error}</div>;
  }

  return (
    <div className="quiz-list-container">
      <div className="quiz-list">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="quiz-item"
            onClick={() => handleQuizClick(quiz)}
            role="button"
            tabIndex={0}
            aria-label={`Se detaljer for quiz: ${quiz.tittel}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleQuizClick(quiz);
              }
            }}
          >
            <div className="quiz-background">
              <div className="quiz-info-container">
                <p>{quiz.quiz_type}</p>
                <p>{quiz.antall_sporsmal} spm</p>
                <p>{quiz.vanskelighetsgrad}</p>
              </div>
              <Image
                src={quiz.bakgrunnsbilde || FALLBACK_IMAGE}
                alt={quiz.tittel}
                layout="fill"
                objectFit="cover"
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
            </div>
            <div className="quiz-info">
              <h2 className="quiz-title">{quiz.tittel}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
