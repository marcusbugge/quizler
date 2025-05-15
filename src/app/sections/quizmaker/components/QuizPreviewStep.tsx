import React, { useState } from "react";
import {
  SporsmalData,
  MultipleChoiceSporsmal,
  HoytlesningSporsmal,
} from "../models/types";
import {
  TrueFalseSporsmal,
  GuessTheYearSporsmal,
} from "../models/extendedTypes";
import MultipleChoicePreview from "./quiz-previews/MultipleChoicePreview";
import HoytlesningPreview from "./quiz-previews/HoytlesningPreview";
import FlashcardsPreview from "./quiz-previews/FlashcardsPreview";
import TrueFalsePreview from "./quiz-previews/TrueFalsePreview";
import GuessTheYearPreview from "./quiz-previews/GuessTheYearPreview";
import "./quizPreview.scss";

interface QuizPreviewStepProps {
  sporsmal: SporsmalData[];
  prompt: string;
  quizType: string;
  onConfirm: () => void;
  onCancel: () => void;
  vanskelighetsgrad: string;
  antallSporsmal: number;
  onUpdateSporsmal: (oppdatertSporsmal: SporsmalData[]) => void;
}

const QuizPreviewStep: React.FC<QuizPreviewStepProps> = ({
  sporsmal,
  prompt,
  quizType,
  onConfirm,
  onCancel,
  vanskelighetsgrad,
  antallSporsmal,
  onUpdateSporsmal,
}) => {
  const [redigeringsIndeks, setRedigeringsIndeks] = useState<number | null>(
    null
  );
  const [redigertData, setRedigertData] = useState<SporsmalData | null>(null);

  // Funksjon for å konvertere vanskelighetsgrad til emoji
  const getVanskelighetsEmoji = (vanskelighetsgrad: string): string => {
    switch (vanskelighetsgrad.toLowerCase()) {
      case "lett":
        return "😴";
      case "middels":
        return "😀";
      case "vanskelig":
        return "😮";
      case "ekspert":
        return "💪";
      case "umulig":
        return "😰";
      case "ekstrem":
        return "🥵";
      default:
        return "😀"; // Standard emoji om vanskelighetsgraden ikke gjenkjennes
    }
  };

  // Funksjon for å vise riktig quiz-type tekst
  const getQuizTypeText = (quizType: string): string => {
    switch (quizType) {
      case "multiple-choice":
        return "Multiple Choice";
      case "read-aloud":
        return "Spørsmål og svar";
      case "flashcards":
        return "Flashcards";
      case "true-false":
        return "Sann/Usann";
      case "guess-the-year":
        return "Gjett året";
      default:
        return quizType;
    }
  };

  // Funksjon for å starte redigering av et spørsmål
  const startRedigering = (index: number) => {
    setRedigeringsIndeks(index);
    setRedigertData({ ...sporsmal[index] });
  };

  // Funksjon for å avbryte redigering
  const avbrytRedigering = () => {
    setRedigeringsIndeks(null);
    setRedigertData(null);
  };

  // Funksjon for å lagre redigering
  const lagreRedigering = () => {
    if (redigeringsIndeks !== null && redigertData !== null) {
      const oppdatertSporsmal = [...sporsmal];
      oppdatertSporsmal[redigeringsIndeks] = redigertData;
      onUpdateSporsmal(oppdatertSporsmal);
      setRedigeringsIndeks(null);
      setRedigertData(null);
    }
  };

  // Funksjon for å oppdatere redigert data
  const oppdaterRedigertData = (felt: string, verdi: any) => {
    if (redigertData) {
      setRedigertData({
        ...redigertData,
        [felt]: verdi,
      });
    }
  };

  // Factory-funksjon for å vise riktig type spørsmål
  const renderSporsmalFactory = (sporsmal: SporsmalData, index: number) => {
    console.log(
      "Spørsmål type:",
      sporsmal.quizType,
      "Full spørsmål:",
      sporsmal
    );

    // Er dette spørsmålet i redigeringsmodus?
    const erIRedigering = redigeringsIndeks === index;
    const visSporsmal = erIRedigering && redigertData ? redigertData : sporsmal;

    // Sjekk hvilken type quiz og vis riktig komponent
    const type = sporsmal.quizType.toLowerCase().replace("_", "-");

    // Renderer spørsmålskomponenten med redigeringsfunksjonalitet
    const renderSporsmalMedRediger = (previewComponent: JSX.Element) => (
      <div className="quiz-preview-item">
        {previewComponent}
        {erIRedigering ? (
          <div className="quiz-redigering-knapper">
            <button className="rediger-lagre" onClick={lagreRedigering}>
              Lagre endringer
            </button>
            <button className="rediger-avbryt" onClick={avbrytRedigering}>
              Avbryt
            </button>
          </div>
        ) : (
          <button
            className="rediger-knapp"
            onClick={() => startRedigering(index)}
          >
            Rediger spørsmål
          </button>
        )}
      </div>
    );

    if (type === "multiple-choice" || type === "multiple_choice") {
      const mcSporsmal = visSporsmal as MultipleChoiceSporsmal;
      return renderSporsmalMedRediger(
        <MultipleChoicePreview
          sporsmal={mcSporsmal}
          index={index}
          erRedigering={erIRedigering}
          oppdaterSporsmal={erIRedigering ? oppdaterRedigertData : undefined}
        />
      );
    } else if (type === "flashcards") {
      const fcSporsmal = visSporsmal as HoytlesningSporsmal;
      return renderSporsmalMedRediger(
        <FlashcardsPreview
          sporsmal={fcSporsmal}
          index={index}
          erRedigering={erIRedigering}
          oppdaterSporsmal={erIRedigering ? oppdaterRedigertData : undefined}
        />
      );
    } else if (type === "true-false") {
      const tfSporsmal = visSporsmal as TrueFalseSporsmal;
      return renderSporsmalMedRediger(
        <TrueFalsePreview
          sporsmal={tfSporsmal}
          index={index}
          erRedigering={erIRedigering}
          oppdaterSporsmal={erIRedigering ? oppdaterRedigertData : undefined}
        />
      );
    } else if (type === "guess-the-year") {
      const gySporsmal = visSporsmal as GuessTheYearSporsmal;
      return renderSporsmalMedRediger(
        <GuessTheYearPreview
          sporsmal={gySporsmal}
          index={index}
          erRedigering={erIRedigering}
          oppdaterSporsmal={erIRedigering ? oppdaterRedigertData : undefined}
        />
      );
    } else {
      // Default: høytlesning/spørsmål og svar
      const hlSporsmal = visSporsmal as HoytlesningSporsmal;
      return renderSporsmalMedRediger(
        <HoytlesningPreview
          sporsmal={hlSporsmal}
          index={index}
          erRedigering={erIRedigering}
          oppdaterSporsmal={erIRedigering ? oppdaterRedigertData : undefined}
        />
      );
    }
  };

  return (
    <div className="quiz-step quiz-preview-step">
      <h1 className="quiz-preview-title">Forhåndsvisning av quiz</h1>
      <div className="quiz-preview-info">
        <div className="quiz-preview-header">
          <h2>{prompt}</h2>
          <div className="quiz-preview-meta">
            <span>{getQuizTypeText(quizType)}</span>
            <span>{antallSporsmal} spørsmål</span>
            <span>{getVanskelighetsEmoji(vanskelighetsgrad)}</span>
          </div>
        </div>
        <div className="quiz-preview-sporsmal-list">
          {sporsmal.map((sp, index) => renderSporsmalFactory(sp, index))}
        </div>
      </div>
      <div className="quiz-preview-actions">
        <button className="quiz-preview-button save" onClick={onConfirm}>
          Lagre quiz
        </button>
        <button className="quiz-preview-button cancel" onClick={onCancel}>
          Tilbake
        </button>
      </div>
    </div>
  );
};

export default QuizPreviewStep;
