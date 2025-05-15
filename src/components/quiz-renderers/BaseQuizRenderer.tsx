import React from "react";
import { QuizSporsmal } from "../../types/quiz";
import { useQuiz } from "../../contexts/QuizContext";
import Link from "next/link";
import "./style.scss";
import Leaderboard from "./Leaderboard";

interface BaseQuizRendererProps {
  sporsmal: QuizSporsmal;
  onAnswer: (answer: string | number) => void;
}

export const BaseQuizRenderer: React.FC<BaseQuizRendererProps> = ({
  sporsmal,
}) => {
  return (
    <div className="quiz-question">
      <h2>{sporsmal.sporsmal}</h2>
      {/* Subklasser vil overskrive denne med spesifikk UI */}
    </div>
  );
};

export const QuizProgressBar: React.FC = () => {
  const { quiz, currentQuestion } = useQuiz();

  if (!quiz) return null;

  const progress = Math.round(
    ((currentQuestion + 1) / quiz.sporsmal.length) * 100
  );

  return (
    <div className="quiz-progress">
      <div className="quiz-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
};

export const QuizCompletedView: React.FC<{ quizId: string }> = ({ quizId }) => {
  const { score, quiz, resetQuiz } = useQuiz();

  if (!quiz) return null;

  return (
    <div className="quiz-completed">
      <div className="quiz-completed-content">
        {" "}
        <h2>Quiz Fullført!</h2>
        <p>
          Du fikk {score} av {quiz.sporsmal.length} poeng
        </p>
      </div>

      <div className="quiz-completed-leaderboard">
        <Leaderboard quizId={quizId} />
      </div>
    </div>
  );
};
