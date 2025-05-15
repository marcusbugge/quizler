"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import "./components.scss";

export default function LogoutButton() {
  const { signOut, user } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div className="logout-button-container">
      {user ? (
        <p onClick={signOut}>Trykk her for å logge ut</p>
      ) : (
        <p onClick={handleLogin}>Trykk her for å logge inn</p>
      )}
    </div>
  );
}
