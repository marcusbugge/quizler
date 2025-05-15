"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { QuizType } from "@/types/quiz";
import { genererQuiz } from "@/utils/openai";
import "./style.scss";

// Importer komponentene
import QuizPromptStep from "./components/QuizPromptStep";
import QuizTypeStep from "./components/QuizTypeStep";
import QuizSummaryStep from "./components/QuizSummaryStep";

// Importer typer
import { QuizData } from "./models/types";

/**
 * Hovedkomponent for quiz-maker
 */
export default function Quiz() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({
    prompt: "",
    quizType: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Håndterer endring av prompt
   */
  const handlePromptChange = (newPrompt: string) => {
    setQuizData({ ...quizData, prompt: newPrompt });
  };

  /**
   * Håndterer endring av quiz-type
   */
  const handleQuizTypeChange = (newType: string) => {
    setQuizData({ ...quizData, quizType: newType });
  };

  /**
   * Går til neste steg
   */
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  /**
   * Går til forrige steg
   */
  const prevStep = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  /**
   * Genererer en quiz og navigerer til resultat-siden
   */
  const generateQuiz = async () => {
    try {
      setIsGenerating(true);
      console.log("Genererer quiz med følgende data:", quizData);

      // Konverter quizType fra UI-format til enum-format
      const apiQuizType =
        quizData.quizType === "multiple-choice"
          ? QuizType.MULTIPLE_CHOICE
          : QuizType.HOYTLESNING;

      // Kall API for å generere quiz
      const resultat = await genererQuiz(
        apiQuizType,
        quizData.prompt,
        5, // Antall spørsmål (kan gjøres konfigurerbart senere)
        "middels" // Vanskelighetsgrad (kan gjøres konfigurerbart senere)
      );

      if (resultat?.sporsmal?.length > 0) {
        // Lagre quizzen i sessionStorage for å hente den på resultat-siden
        sessionStorage.setItem("generertQuiz", JSON.stringify(resultat));
        sessionStorage.setItem("quizTema", quizData.prompt);

        // Naviger til resultat-siden
        router.push("/quiz-result");
      } else {
        throw new Error("Ingen spørsmål returnert");
      }
    } catch (error) {
      console.error("Feil ved generering av quiz:", error);
      alert("Noe gikk galt ved generering av quiz. Prøv igjen.");
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Rendrer riktig steg basert på currentStep
   */
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <QuizPromptStep
            onNext={nextStep}
            prompt={quizData.prompt}
            setPrompt={handlePromptChange}
          />
        );
      case 1:
        return (
          <QuizTypeStep
            onNext={nextStep}
            quizType={quizData.quizType}
            setQuizType={handleQuizTypeChange}
            prompt={quizData.prompt}
          />
        );
      case 2:
        return (
          <QuizSummaryStep quizData={quizData} onGenerate={generateQuiz} />
        );
      default:
        return <div>Noe gikk galt</div>;
    }
  };

  return (
    <div className="quiz-container">
      {isGenerating ? (
        <div className="loading-container">
          <h2>Genererer quiz...</h2>
          <div className="loading-spinner"></div>
        </div>
      ) : (
        renderStep()
      )}
    </div>
  );
}
