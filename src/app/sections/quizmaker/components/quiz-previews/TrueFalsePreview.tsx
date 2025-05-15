import React from "react";
import { TrueFalseSporsmal } from "../../models/extendedTypes";

interface TrueFalsePreviewProps {
  sporsmal: TrueFalseSporsmal;
  index: number;
  erRedigering?: boolean;
  oppdaterSporsmal?: (felt: string, verdi: any) => void;
}

const TrueFalsePreview: React.FC<TrueFalsePreviewProps> = ({
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

  // Funksjon for å oppdatere sann/usann-status
  const handleRiktigSvarEndring = (erSann: boolean) => {
    if (oppdaterSporsmal) {
      oppdaterSporsmal("erSann", erSann);
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
          placeholder="Skriv inn påstanden"
        />
      ) : (
        <p>{sporsmal.sporsmal}</p>
      )}
      <div className="quiz-preview-true-false">
        {erRedigering ? (
          <div className="true-false-redigering">
            <label>
              <input
                type="radio"
                name={`sann-usann-${index}`}
                checked={sporsmal.erSann === true}
                onChange={() => handleRiktigSvarEndring(true)}
              />
              Sann
            </label>
            <label>
              <input
                type="radio"
                name={`sann-usann-${index}`}
                checked={sporsmal.erSann === false}
                onChange={() => handleRiktigSvarEndring(false)}
              />
              Usann
            </label>
          </div>
        ) : (
          <div className="true-false-svar">
            <strong>Riktig svar: </strong>
            <span>{sporsmal.erSann ? "Sann" : "Usann"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrueFalsePreview;
