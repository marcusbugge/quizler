"use client";

import React, { useState, useEffect } from "react";
import QuizList from "../sections/quizpage/QuizList";
import "./quiz.scss";
import QuizDetails from "../sections/quizpage/QuizDetails";
import { Quiz } from "../sections/quizpage/QuizList";

export default function Page() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [mounted, setMounted] = useState(false);

  // Sikre at vi er på klientsiden før vi rendrer
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="quiz-page">
      <h1 className="title-page">Utforskeren</h1>
      <div className={`quiz-page-layout ${selectedQuiz ? "with-details" : ""}`}>
        {selectedQuiz && <QuizDetails selectedQuiz={selectedQuiz} />}
        <QuizList onSelectQuiz={setSelectedQuiz} />
      </div>
    </div>
  );
}
