import { SporsmalData } from "./types";

/**
 * Interface for sann/usann-spørsmål
 */
export interface TrueFalseSporsmal extends SporsmalData {
  svar: boolean;
  begrunnelse?: string;
}

/**
 * Interface for gjett-året-spørsmål
 */
export interface GuessTheYearSporsmal extends SporsmalData {
  riktigAar: number;
  beskrivelse?: string;
  hendelse?: string;
}
