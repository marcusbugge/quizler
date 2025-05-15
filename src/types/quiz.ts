/**
 * Enum for forskjellige quiz-typer
 */
export enum QuizType {
  MULTIPLE_CHOICE = "multiple_choice",
  HOYTLESNING = "hoytlesning",
  FLASHCARDS = "flashcards",
  TRUE_FALSE = "true_false",
  GUESS_THE_YEAR = "guess_the_year",
  // Enkel å utvide med flere typer senere
  // FILL_IN_BLANK = 'fill_in_blank',
  // MATCHING = 'matching',
}

/**
 * Interface for base quiz-spørsmål med felles egenskaper
 */
export interface BaseQuizSporsmal {
  id: string;
  sporsmal: string;
  quizType: QuizType;
}

/**
 * Interface for multiple choice quiz-spørsmål
 */
export interface MultipleChoiceSporsmal extends BaseQuizSporsmal {
  quizType: QuizType.MULTIPLE_CHOICE;
  alternativer: string[];
  riktigIndex: number;
}

/**
 * Interface for høytlesnings quiz-spørsmål
 */
export interface HoytlesningSporsmal extends BaseQuizSporsmal {
  quizType: QuizType.HOYTLESNING;
  svar: string;
}

/**
 * Type som kan være alle typer quiz-spørsmål
 */
export type QuizSporsmal = MultipleChoiceSporsmal | HoytlesningSporsmal;

/**
 * Interface for en komplett quiz
 */
export interface Quiz {
  id: string;
  tittel: string;
  dato: string;
  quizType: QuizType;
  sporsmal: QuizSporsmal[];
}

/**
 * Type guard for å sjekke om et spørsmål er multiple choice
 */
export function isMultipleChoice(
  sporsmal: QuizSporsmal
): sporsmal is MultipleChoiceSporsmal {
  return sporsmal.quizType === QuizType.MULTIPLE_CHOICE;
}

/**
 * Type guard for å sjekke om et spørsmål er høytlesning
 */
export function isHoytlesning(
  sporsmal: QuizSporsmal
): sporsmal is HoytlesningSporsmal {
  return sporsmal.quizType === QuizType.HOYTLESNING;
}
