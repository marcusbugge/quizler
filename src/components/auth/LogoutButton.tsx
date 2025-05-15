"use client";

import { useAuth } from "@/contexts/AuthContext";
import styles from "./AuthForms.module.css";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const { signOut } = useAuth();

  return (
    <button onClick={signOut} className={className || styles.buttonPrimary}>
      Logg ut
    </button>
  );
}
