import React, { useState, useEffect } from "react";

interface LeaderboardProps {
  quizId: string; // Definer typen for quizId
}

// Definer type for leaderboard-data (tilbake til original med profiles)
interface CompletionWithProfile {
  completed_at: string;
  score: number | null;
  profiles: {
    username: string;
    avatar_url?: string | null;
  } | null; // Profil kan være null hvis join feiler eller profil mangler
}
export default function Leaderboard({ quizId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<CompletionWithProfile[]>([]); // Bruk typen med profiles
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;

    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true);
      setLeaderboardError(null);
      try {
        const response = await fetch(
          `/api/quizzes/${quizId}/completions?limit=10&sortBy=score&order=desc`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Kunne ikke hente leaderboard-data"
          );
        }
        const data = await response.json();
        setLeaderboard(Array.isArray(data.completions) ? data.completions : []);
      } catch (err: unknown) {
        setLeaderboardError(
          err instanceof Error ? err.message : "En ukjent feil oppstod"
        );
        setLeaderboard([]);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, [quizId]);
  return <div>     <h3>Leaderboard (Topp 10)</h3>
      {loadingLeaderboard ? (
        <p>Laster leaderboard...</p>
      ) : leaderboardError ? (
        <p style={{ color: "red" }}>Feil: {leaderboardError}</p>
      ) : leaderboard.length > 0 ? (
        <ol>
          {leaderboard.map((entry, index) => (
            // Tilbake til å vise brukernavn fra profiles
            <li key={entry.profiles?.username ?? `user-${index}`}>
              <strong>{entry.profiles?.username ?? "Ukjent bruker"}</strong>
              {entry.score !== null && ` - Score: ${entry.score}`}
            </li>
          ))}
        </ol>
      ) : (
        <p>Ingen fullføringer registrert ennå.</p>
      )}</div>;
}
