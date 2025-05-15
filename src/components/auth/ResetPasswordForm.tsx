"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ErrorMessage from "../ui/ErrorMessage";
import SuccessMessage from "../ui/SuccessMessage";
import styles from "./AuthForms.module.css";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { updatePassword } = useAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Passordet må være minst 8 tegn langt");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passordene samsvarer ikke");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await updatePassword(password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Automatisk omdirigering til innloggingssiden etter 3 sekunder
    setTimeout(() => {
      router.push("/auth/login");
    }, 3000);
  };

  // Sjekk om det er en gyldig tilbakestillingsforespørsel
  useEffect(() => {
    // Her bruker vi AuthContext istedenfor å sjekke direkte
    // Hvis brukeren ikke er logget inn, betyr det at tilbakestillingslenken
    // ikke er gyldig eller har utløpt
  }, []);

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Tilbakestill passord</h2>

      <ErrorMessage message={error} />

      {success ? (
        <SuccessMessage message="Passordet ditt er oppdatert. Du blir omdirigert til innloggingssiden..." />
      ) : (
        <form onSubmit={handleResetPassword} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Nytt passord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={styles.input}
            />
            <small className={styles.helpText}>
              Passordet må være minst 8 tegn langt
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Bekreft nytt passord
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.buttonSecondary}
          >
            {loading ? "Oppdaterer..." : "Tilbakestill passord"}
          </button>
        </form>
      )}
    </div>
  );
}
