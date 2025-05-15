"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { User } from "@supabase/supabase-js";
import { createBrowserClient } from "@/lib/supabase";

interface LoginIconProps {
  size?: number;
}

interface UserProfile {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
}

export default function LoginIcon({ size = 40 }: LoginIconProps) {
  const { user, loading } = useUser();
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    // Genererer tilfeldige farger ved første render
    generateRandomColors();
  }, []);

  useEffect(() => {
    // Hent brukerprofil når bruker endres
    if (user && !profile) {
      fetchUserProfile(user.id);
    } else if (!user) {
      setProfile(null);
    }
  }, [user]);

  const fetchUserProfile = async (userId: string) => {
    try {
      setProfileLoading(true);
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("username, first_name, last_name")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Feil ved henting av brukerprofil:", error);
      } else if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error("Uventet feil ved henting av brukerprofil:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const generateRandomColors = () => {
    const getRandomColor = () => {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 70%, 65%)`;
    };

    setGradientColors([getRandomColor(), getRandomColor()]);
  };

  const getInitials = (user: User | null, profile: UserProfile | null) => {
    if (!user) return "?";

    // Prøv å bruke fornavn og etternavn hvis tilgjengelig
    if (profile && profile.first_name && profile.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }

    // Prøv å bruke brukernavn hvis tilgjengelig
    if (profile && profile.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }

    // Prøver å hente fra user metadata hvis tilgjengelig
    if (user.user_metadata && user.user_metadata.full_name) {
      const name = user.user_metadata.full_name;
      const words = name.split(" ");
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }

    // Fallback til e-post
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }

    return "?";
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: `${size / 2.5}px`,
        color: "white",
      }}
    >
      {loading || profileLoading ? "..." : getInitials(user, profile)}
    </div>
  );
}
