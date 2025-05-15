import React from "react";
import { MultipleChoiceSporsmal, isMultipleChoice } from "../../types/quiz";
import "./style.scss";

interface MultipleChoiceRendererProps {
  sporsmal: MultipleChoiceSporsmal;
  onAnswer: (answer: number) => void;
}

export const MultipleChoiceRenderer: React.FC<MultipleChoiceRendererProps> = ({
  sporsmal,
  onAnswer,
}) => {
  // Type guard for å sikre at vi har riktig type spørsmål
  if (!isMultipleChoice(sporsmal)) {
    return <div>Feil type spørsmål</div>;
  }

  // Håndter klikk på svaralternativ
  const handleAnswerClick = (index: number) => {
    console.log(`DEBUG: Klikket på alternativ ${index}:`, {
      alternativ: sporsmal.alternativer[index],
      riktigIndex: sporsmal.riktigIndex,
      erRiktig: index === sporsmal.riktigIndex,
    });
    onAnswer(index);
  };

  return (
    <div className="multiple-choice-quiz">
      <h1>{sporsmal.sporsmal}</h1>
      <div className="answer-options">
        {sporsmal.alternativer.map((alternativ, index) => (
          <button
            key={index}
            className="answer-option"
            onClick={() => handleAnswerClick(index)}
          >
            {alternativ}
          </button>
        ))}
      </div>
    </div>
  );
};
