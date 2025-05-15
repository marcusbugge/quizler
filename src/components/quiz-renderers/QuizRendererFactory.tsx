import React from "react";
import { QuizSporsmal, QuizType } from "../../types/quiz";
import { MultipleChoiceRenderer } from "./MultipleChoiceRenderer";
import { HoytlesningRenderer } from "./HoytlesningRenderer";

interface QuizRendererFactoryProps {
  sporsmal: QuizSporsmal;
  onAnswer: (answer: string | number) => void;
}

export const QuizRendererFactory: React.FC<QuizRendererFactoryProps> = ({
  sporsmal,
  onAnswer,
}) => {
  // Velg riktig renderer basert på quiz-type
  switch (sporsmal.quizType) {
    case QuizType.MULTIPLE_CHOICE:
      return (
        <MultipleChoiceRenderer
          sporsmal={sporsmal}
          onAnswer={onAnswer as (answer: number) => void}
        />
      );
    case QuizType.HOYTLESNING:
      return (
        <HoytlesningRenderer
          sporsmal={sporsmal}
          onAnswer={onAnswer as (answer: string) => void}
        />
      );
    // Kan enkelt utvide med flere quiz-typer her
    default:
      return (
        <div className="unsupported-quiz-type">
          <h2>Ikke støttet quiz-type: {sporsmal.quizType}</h2>
        </div>
      );
  }
};
