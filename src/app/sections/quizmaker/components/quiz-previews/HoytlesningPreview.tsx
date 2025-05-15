import React from "react";
import { HoytlesningSporsmal } from "../../models/types";

interface HoytlesningPreviewProps {
  sporsmal: HoytlesningSporsmal;
  index: number;
  erRedigering?: boolean;
  oppdaterSporsmal?: (felt: string, verdi: any) => void;
}

const HoytlesningPreview: React.FC<HoytlesningPreviewProps> = ({
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

  // Funksjon for å oppdatere svar
  const handleSvarEndring = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (oppdaterSporsmal) {
      oppdaterSporsmal("svar", e.target.value);
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
      <div className="quiz-preview-svar">
        <strong>Svar: </strong>
        {erRedigering ? (
          <input
            type="text"
            value={sporsmal.svar}
            onChange={handleSvarEndring}
            className="svar-redigering-input"
            placeholder="Skriv inn svaret"
          />
        ) : (
          <span>{sporsmal.svar}</span>
        )}
      </div>
    </div>
  );
};

export default HoytlesningPreview;
