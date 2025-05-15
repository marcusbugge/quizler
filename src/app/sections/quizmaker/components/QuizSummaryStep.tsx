import React, { KeyboardEvent } from "react";

interface QuizData {
  prompt: string;
  quizType: string;
}

interface QuizSummaryStepProps {
  quizData: QuizData;
  onGenerate: () => void;
}

const QuizSummaryStep: React.FC<QuizSummaryStepProps> = ({
  quizData,
  onGenerate,
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      onGenerate();
    }
  };

  return (
    <div className="quiz-step" onKeyPress={handleKeyPress} tabIndex={0}>
      <h1>Oppsummering av din quiz</h1>
      <div className="quiz-summary">
        <div className="summary-item">
          <h3>Emne:</h3>
          <p>{quizData.prompt}</p>
        </div>
        <div className="summary-item">
          <h3>Type:</h3>
          <p>
            {quizData.quizType === "multiple-choice"
              ? "Multiple Choice"
              : "Høytlesing"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizSummaryStep;
