import { HoytlesningSporsmal, isHoytlesning } from "../../types/quiz";
import { useQuiz } from "../../contexts/QuizContext";
import "./style.scss";

interface HoytlesningRendererProps {
  sporsmal: HoytlesningSporsmal;
  onAnswer: (answer: string) => void;
}

export const HoytlesningRenderer: React.FC<HoytlesningRendererProps> = ({
  sporsmal,
}) => {
  // Hent hele quizzen fra konteksten
  const { quiz } = useQuiz();

  // Type guard for å sikre at vi har riktig type spørsmål
  if (!isHoytlesning(sporsmal)) {
    return <div>Feil type spørsmål</div>;
  }

  if (!quiz) {
    return <div>Ingen quiz funnet</div>;
  }

  return (
    <div className="hoytlesning-quiz">
      <div className="hoytlesning-liste">
        {quiz.sporsmal.map((q, index) => {
          // Vi må sjekke om spørsmålet er høytlesning
          if (isHoytlesning(q)) {
            return (
              <div key={q.id} className="hoytlesning-item">
                <div className="circle-container">
                  <div className="circle">{index + 1}</div>
                </div>
                <div className="hoytlesning-item-content">
                  <p>{q.sporsmal}</p>
                  <p className="svar">{q.svar}</p>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
