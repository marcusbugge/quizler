/**
 * Grunnleggende datamodell for en quiz
 */
export interface QuizData {
  prompt: string;
  quizType: string;
}

/**
 * Interface for stegkomponentenes props
 */
export interface StepProps {
  nextStep: () => void;
  prevStep?: () => void;
}

/**
 * Interface for quiz-generering-respons
 */
export interface QuizGenerertResultat {
  sporsmal: SporsmalData[];
  tittelforslag?: string;
}

/**
 * Interface for spørsmålsdata - basisfelter
 */
export interface SporsmalData {
  id: string;
  sporsmal: string;
  quizType: string;
}

/**
 * Interface for Multiple Choice-spørsmål
 */
export interface MultipleChoiceSporsmal extends SporsmalData {
  alternativer: string[];
  riktigIndex: number;
}

/**
 * Interface for høytlesningsspørsmål
 */
export interface HoytlesningSporsmal extends SporsmalData {
  svar: string;
}
