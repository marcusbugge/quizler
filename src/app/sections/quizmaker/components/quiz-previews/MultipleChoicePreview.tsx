import React from "react";
import { MultipleChoiceSporsmal } from "../../../quizmaker/models/types";

interface MultipleChoicePreviewProps {
  sporsmal: MultipleChoiceSporsmal;
  index: number;
  erRedigering?: boolean;
  oppdaterSporsmal?: (felt: string, verdi: any) => void;
}

const MultipleChoicePreview: React.FC<MultipleChoicePreviewProps> = ({
  sporsmal,
  index,
  erRedigering = false,
  oppdaterSporsmal,
}) => {
  // Funksjon for å oppdatere spørsmålstekst
  const handleSporsmalEndring = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (oppdaterSporsmal) {
      oppdaterSporsmal("sporsmal", e.target.value);
    }
  };

  // Funksjon for å oppdatere et alternativ
  const handleAlternativEndring = (alternativIndex: number, tekst: string) => {
    if (oppdaterSporsmal) {
      const nyeAlternativer = [...sporsmal.alternativer];
      nyeAlternativer[alternativIndex] = tekst;
      oppdaterSporsmal("alternativer", nyeAlternativer);
    }
  };

  // Funksjon for å sette riktig svar
  const settRiktigSvar = (alternativIndex: number) => {
    if (oppdaterSporsmal) {
      oppdaterSporsmal("riktigIndex", alternativIndex);
    }
  };

  return (
    <div className="quiz-preview-sporsmal">
      <h3>Spørsmål {index + 1}</h3>
      {erRedigering ? (
        <input
          type="text"
          value={sporsmal.sporsmal}
          onChange={handleSporsmalEndring}
          className="sporsmal-redigering-input"
          placeholder="Skriv inn spørsmålet"
        />
      ) : (
        <p>{sporsmal.sporsmal}</p>
      )}
      <div className="quiz-preview-alternativer">
        {sporsmal.alternativer.map((alt, altIndex) => (
          <div
            key={altIndex}
            className={`quiz-preview-alternativ ${
              altIndex === sporsmal.riktigIndex ? "riktig" : ""
            }`}
          >
            <span>{String.fromCharCode(65 + altIndex)}:</span>
            {erRedigering ? (
              <>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) =>
                    handleAlternativEndring(altIndex, e.target.value)
                  }
                  className="alternativ-redigering-input"
                />
                <input
                  type="radio"
                  name={`riktig-svar-${index}`}
                  checked={altIndex === sporsmal.riktigIndex}
                  onChange={() => settRiktigSvar(altIndex)}
                />
              </>
            ) : (
              <>
                {alt}
                {altIndex === sporsmal.riktigIndex && (
                  <span className="riktig-svar"> ✓</span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoicePreview;
