"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { RateLimiter } from "@/utils/rateLimiter";
import ErrorMessage from "../ui/ErrorMessage";
import SuccessMessage from "../ui/SuccessMessage";
import styles from "./AuthForms.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, resetPassword } = useAuth();

  // Rate Limiter for innlogging
  const loginLimiter = new RateLimiter("loginRateLimit");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sjekk rate limiting
    const { allowed, timeLeft } = loginLimiter.check();
    if (!allowed) {
      setError(
        `For mange innloggingsforsøk. Prøv igjen om ${timeLeft} minutter.`
      );
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Vennligst fyll inn e-postadressen din");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccessMessage(
      "Sjekk e-posten din for instruksjoner om tilbakestilling av passord"
    );
    setLoading(false);
    setShowForgotPassword(false); // Gå tilbake til innloggingsskjermen
  };

  // Vis komponenten for glemt passord
  if (showForgotPassword) {
    return (
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Glemt passord?</h2>

        <ErrorMessage message={error} />
        <SuccessMessage message={successMessage} />

        <form onSubmit={handleForgotPassword} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              E-post
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
            <small className={styles.helpText}>
              Skriv inn e-postadressen din for å få en lenke for å tilbakestille
              passordet
            </small>
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className={styles.buttonTertiary}
            >
              Tilbake
            </button>

            <button
              type="submit"
              disabled={loading}
              className={styles.buttonSecondary}
            >
              {loading ? "Sender..." : "Send lenke"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Standard innloggingsskjerm
  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Logg inn</h2>

      <ErrorMessage message={error} />
      <SuccessMessage message={successMessage} />

      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            E-post
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Passord
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <div className={styles.forgotPassword}>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className={styles.forgotPasswordLink}
            >
              Glemt passord?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.buttonPrimary}
        >
          {loading ? "Logger inn..." : "Logg inn"}
        </button>

        <div className={styles.linkContainer}>
          <p>
            Har du ikke en konto?{" "}
            <Link href="/auth/signup" className={styles.link}>
              Registrer deg her
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
