import React, { useState } from "react";
import { HoytlesningSporsmal } from "../../models/types";

interface FlashcardsPreviewProps {
  sporsmal: HoytlesningSporsmal;
  index: number;
  erRedigering?: boolean;
  oppdaterSporsmal?: (felt: string, verdi: any) => void;
}

const FlashcardsPreview: React.FC<FlashcardsPreviewProps> = ({
  sporsmal,
  index,
  erRedigering = false,
  oppdaterSporsmal,
}) => {
  const [visKort, setVisKort] = useState(false);

  // Funksjon for å oppdatere spørsmålstekst (forside av kortet)
  const handleSporsmalEndring = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (oppdaterSporsmal) {
      oppdaterSporsmal("sporsmal", e.target.value);
    }
  };

  // Funksjon for å oppdatere svar (baksiden av kortet)
  const handleSvarEndring = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (oppdaterSporsmal) {
      oppdaterSporsmal("svar", e.target.value);
    }
  };

  return (
    <div className="quiz-preview-sporsmal flashcard-preview">
      <h3>Kort {index + 1}</h3>

      <div
        className={`flashcard ${visKort ? "snudd" : ""}`}
        onClick={() => !erRedigering && setVisKort(!visKort)}
      >
        <div className="flashcard-front">
          {erRedigering ? (
            <input
              type="text"
              value={sporsmal.sporsmal}
              onChange={handleSporsmalEndring}
              className="sporsmal-redigering-input"
              placeholder="Forside av kortet"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p>{sporsmal.sporsmal}</p>
          )}
        </div>

        <div className="flashcard-back">
          {erRedigering ? (
            <input
              type="text"
              value={sporsmal.svar}
              onChange={handleSvarEndring}
              className="svar-redigering-input"
              placeholder="Bakside av kortet"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p>{sporsmal.svar}</p>
          )}
        </div>
      </div>

      {!erRedigering && (
        <button
          className="flashcard-snu-knapp"
          onClick={() => setVisKort(!visKort)}
        >
          {visKort ? "Vis forside" : "Vis bakside"}
        </button>
      )}
    </div>
  );
};

export default FlashcardsPreview;
