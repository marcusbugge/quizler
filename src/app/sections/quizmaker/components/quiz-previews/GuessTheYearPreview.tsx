import React from "react";
import { GuessTheYearSporsmal } from "../../models/extendedTypes";

interface GuessTheYearPreviewProps {
  sporsmal: GuessTheYearSporsmal;
  index: number;
  erRedigering?: boolean;
  oppdaterSporsmal?: (felt: string, verdi: any) => void;
}

const GuessTheYearPreview: React.FC<GuessTheYearPreviewProps> = ({
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

  // Funksjon for å oppdatere årstall
  const handleAarstallEndring = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (oppdaterSporsmal && !isNaN(parseInt(e.target.value))) {
      oppdaterSporsmal("aarstall", parseInt(e.target.value));
    }
  };

  // Funksjon for å oppdatere marginBuffer (hvor mange år fra eller til svaret er korrekt)
  const handleMarginEndring = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (oppdaterSporsmal && !isNaN(parseInt(e.target.value))) {
      oppdaterSporsmal("marginBuffer", parseInt(e.target.value));
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
      <div className="quiz-preview-aarstall">
        {erRedigering ? (
          <div className="aarstall-redigering">
            <div className="aarstall-input-gruppe">
              <label htmlFor={`aarstall-${index}`}>Riktig årstall:</label>
              <input
                id={`aarstall-${index}`}
                type="number"
                value={sporsmal.aarstall}
                onChange={handleAarstallEndring}
                className="aarstall-input"
              />
            </div>
            <div className="margin-input-gruppe">
              <label htmlFor={`margin-${index}`}>Margin (± år):</label>
              <input
                id={`margin-${index}`}
                type="number"
                value={sporsmal.marginBuffer}
                onChange={handleMarginEndring}
                min="0"
                className="margin-input"
              />
            </div>
          </div>
        ) : (
          <div className="aarstall-svar">
            <strong>Riktig årstall: </strong>
            <span>{sporsmal.aarstall}</span>
            {sporsmal.marginBuffer > 0 && (
              <span> (±{sporsmal.marginBuffer} år)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuessTheYearPreview;
