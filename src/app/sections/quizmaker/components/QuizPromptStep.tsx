import Image from "next/image";
import React, { KeyboardEvent } from "react";

interface QuizPromptStepProps {
  onNext: () => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const QuizPromptStep: React.FC<QuizPromptStepProps> = ({
  onNext,
  prompt,
  setPrompt,
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && prompt.trim()) {
      onNext();
    }
  };

  return (
    <div className="quiz-step">
      <div className="quiz-prompt-containerr">
        <p>Lag din helt egen quiz på enkelt vis</p>
        <h1>Generer en quiz</h1>
        <div className="quiz-container-input">
          <input
            type="text"
            placeholder="Skriv inn et emne"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="quiz-container-input-button">
            <button>
              <Image
                src="/aistar.png"
                alt="Generate Stars"
                width={24}
                height={24}
                style={{ filter: "invert(1)" }} // Dette vil gjøre bildet hvitt
              />
              <span>Generer</span>
            </button>
          </div>
        </div>
      </div>

      <div className="quiz-nav-buttons">
        <button className="nav-button back-button" disabled={true}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          className="nav-button next-button"
          onClick={onNext}
          disabled={!prompt.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuizPromptStep;
