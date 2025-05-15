"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createBrowserClient } from "@/lib/supabase";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient();

    // Hent gjeldende session
    const getUser = async () => {
      setLoading(true);
      try {
        // Sørger for at session er hentet før vi henter bruker
        await supabase.auth.getSession();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Feil ved henting av bruker:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Lytt på auth-endringer
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
