interface RateLimitInfo {
  attempts: number;
  lastAttemptTime: number;
}

export class RateLimiter {
  private key: string;
  private maxAttempts: number;
  private cooldownPeriod: number;

  constructor(key: string, maxAttempts = 5, cooldownPeriodMinutes = 5) {
    this.key = key;
    this.maxAttempts = maxAttempts;
    this.cooldownPeriod = cooldownPeriodMinutes * 60 * 1000;
  }

  check(): { allowed: boolean; timeLeft?: number } {
    // Bare hvis vi kjører i en browser
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return { allowed: true };
    }

    // Henter rate limit info fra localStorage
    const rateLimitInfoStr = localStorage.getItem(this.key);
    const now = Date.now();
    let rateLimitInfo: RateLimitInfo = rateLimitInfoStr
      ? JSON.parse(rateLimitInfoStr)
      : { attempts: 0, lastAttemptTime: now };

    // Tilbakestill hvis cooldown-periode er over
    if (now - rateLimitInfo.lastAttemptTime > this.cooldownPeriod) {
      rateLimitInfo = { attempts: 0, lastAttemptTime: now };
    }

    // Sjekk om vi har nådd maks antall forsøk
    if (rateLimitInfo.attempts >= this.maxAttempts) {
      const timeLeft = Math.ceil(
        (this.cooldownPeriod - (now - rateLimitInfo.lastAttemptTime)) / 60000
      );
      return { allowed: false, timeLeft };
    }

    // Oppdater rate limit info
    rateLimitInfo.attempts += 1;
    rateLimitInfo.lastAttemptTime = now;
    localStorage.setItem(this.key, JSON.stringify(rateLimitInfo));

    return { allowed: true };
  }

  // Tilbakestill rate limiting-telleren
  reset(): void {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }
    localStorage.removeItem(this.key);
  }
}
