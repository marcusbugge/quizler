"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { RateLimiter } from "@/utils/rateLimiter";
import ErrorMessage from "../ui/ErrorMessage";
import SuccessMessage from "../ui/SuccessMessage";
import styles from "./AuthForms.module.css";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { signUp } = useAuth();

  // Rate Limiter for registrering
  const signupLimiter = new RateLimiter("signupRateLimit");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sjekk rate limiting
    const { allowed, timeLeft } = signupLimiter.check();
    if (!allowed) {
      setError(
        `For mange registreringsforsøk. Prøv igjen om ${timeLeft} minutter.`
      );
      return;
    }

    // Validering
    if (password.length < 8) {
      setError("Passordet må være minst 8 tegn langt");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Registrer bruker
    const result = await signUp(email, password, {
      username,
      first_name: firstName,
      last_name: lastName,
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    // Viser beskjed om at brukeren må verifisere e-posten sin
    setSuccessMessage("Sjekk e-posten din for bekreftelseslenke");
    setLoading(false);

    // Nulstill skjemaet
    setEmail("");
    setPassword("");
    setUsername("");
    setFirstName("");
    setLastName("");
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Registrer ny bruker</h2>

      <ErrorMessage message={error} />
      <SuccessMessage message={successMessage} />

      <form onSubmit={handleSignUp} className={styles.form}>
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
          <label htmlFor="username" className={styles.label}>
            Brukernavn
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="firstName" className={styles.label}>
            Fornavn
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName" className={styles.label}>
            Etternavn
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
            minLength={8}
            className={styles.input}
          />
          <small className={styles.helpText}>
            Passordet må være minst 8 tegn langt
          </small>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.buttonSecondary}
        >
          {loading ? "Registrerer..." : "Registrer deg"}
        </button>

        <div className={styles.linkContainer}>
          <p>
            Har du allerede en konto?{" "}
            <Link href="/auth/login" className={styles.link}>
              Logg inn her
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
