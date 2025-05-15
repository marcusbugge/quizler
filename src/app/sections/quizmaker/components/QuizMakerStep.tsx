import React, { useState } from "react";
import { SporsmalData } from "../models/types";
import QuizPreviewStep from "./QuizPreviewStep";

interface QuizMakerStepProps {
  prompt: string;
  quizType: string;
  sporsmal: SporsmalData[];
  vanskelighetsgrad: string;
  onNext: () => void;
  onPrevious: () => void;
  onSaveQuiz: (oppdatertSporsmal: SporsmalData[]) => void;
}

const QuizMakerStep: React.FC<QuizMakerStepProps> = ({
  prompt,
  quizType,
  sporsmal,
  vanskelighetsgrad,
  onNext,
  onPrevious,
  onSaveQuiz,
}) => {
  const [oppdatertSporsmal, setOppdatertSporsmal] =
    useState<SporsmalData[]>(sporsmal);

  // Funksjon for å håndtere oppdatering av spørsmål
  const handleUpdateSporsmal = (nyeSporsmal: SporsmalData[]) => {
    setOppdatertSporsmal(nyeSporsmal);
  };

  // Funksjon for å lagre quizen
  const handleConfirm = () => {
    onSaveQuiz(oppdatertSporsmal);
    onNext();
  };

  return (
    <QuizPreviewStep
      sporsmal={oppdatertSporsmal}
      prompt={prompt}
      quizType={quizType}
      onConfirm={handleConfirm}
      onCancel={onPrevious}
      vanskelighetsgrad={vanskelighetsgrad}
      antallSporsmal={oppdatertSporsmal.length}
      onUpdateSporsmal={handleUpdateSporsmal}
    />
  );
};

export default QuizMakerStep;
