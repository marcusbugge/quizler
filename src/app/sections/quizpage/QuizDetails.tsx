import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface QuizDetailsProps {
  selectedQuiz: {
    id: string;
    tittel: string;
    dato: string;
    quiz_type: string;
    bakgrunnsbilde: string;
    antall_sporsmal: number;
    vanskelighetsgrad: string;
    vanskelighetsgrad_emoji: string;
    opprettet_av: {
      navn: string;
      profilbilde: string;
    };
  } | null;
}

const QuizDetails: React.FC<QuizDetailsProps> = ({ selectedQuiz }) => {
  const router = useRouter();

  // Hvis ingen quiz er valgt, ikke vis noe
  if (!selectedQuiz) return null;

  // Funksjon for å håndtere start quiz klikk
  const handleStartQuiz = () => {
    router.push(`/play/${selectedQuiz.id}`);
  };

  return (
    <div className="quiz-details-sidebar">
      <div className="quiz-details-image">
        <Image
          src={selectedQuiz.bakgrunnsbilde || "/bg1.jpg"}
          alt={selectedQuiz.tittel}
          fill={true}
          objectFit="cover"
        />
      </div>

      <div className="sidebar-buttons">
        <button className="quiz-details-button" onClick={handleStartQuiz}>
          Start Quiz
        </button>

        <div className="buttons-more">
          <button className="quiz-share-button">
            <Image src="/share1.svg" alt="Share" width={30} height={50} />
          </button>
          <button className="quiz-share-button">
            <Image src="/heart1.svg" alt="Heart" width={30} height={50} />
          </button>
        </div>
      </div>
      <div className="quiz-details-info">
        <h2>{selectedQuiz.tittel}</h2>
        <p className="quiz-details-info-text">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industrys standard dummy text ever
          since the 1500s, when an unknown printer.
        </p>

        <div className="quiz-creator">
          <div className="creator-profile">
            <div className="creator-image">
              <Image
                src={selectedQuiz.opprettet_av?.profilbilde || "/defaultpb.png"}
                alt={selectedQuiz.opprettet_av?.navn || "Ukjent bruker"}
                width={50}
                height={50}
              />
            </div>
            <div className="made-by">
              <p className="made-by-text">Laget av</p>
              <p className="creator-name">
                {selectedQuiz.opprettet_av?.navn || "Ukjent bruker"}
              </p>
            </div>
          </div>
        </div>

        <div className="quiz-data-details">
          <div className="quiz-data-details-item">
            <div className="emoji-container">
              <span className="difficulty-emoji">
                {selectedQuiz.vanskelighetsgrad_emoji || "📚"}
              </span>
            </div>
            <div>
              <p className="gray-text">Spørsmål</p>
              <p className="creator-name">
                {selectedQuiz.antall_sporsmal} spørsmål
              </p>
            </div>
          </div>
          <div className="quiz-data-details-item">
            <div className="emoji-container">
              <span className="difficulty-emoji">
                {selectedQuiz.vanskelighetsgrad_emoji || "🧠"}
              </span>
            </div>
            <div>
              <p className="gray-text">Vanskelighetsgrad</p>
              <p className="creator-name">{selectedQuiz.vanskelighetsgrad}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;
