import React from "react";
import "../../app/styles.css";
import Link from "next/link";
import "./style.scss";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import LogoutButton from "../LogoutButton";
const Navbar = () => {
  const { user } = useUser();

  // Funksjon for å hente initialer fra brukerens epost
  const getInitials = (email: string | undefined) => {
    if (!email) return "?";
    return email.charAt(0).toUpperCase();
  };

  // Hent fornavn fra epost
  const getFirstName = (email: string | undefined) => {
    if (!email) return "gjest";
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <nav className="vertical-navbar">
      {user && (
        <div className="user-profile">
          <div className="initials-circle">{getInitials(user.email)}</div>
          <div className="user-greeting">
            <h1>Navn Navnesen</h1>
            <p>Pro version</p>
          </div>
        </div>
      )}
      <div className="navbar-links">
        <p className="navbar-link-title">Main</p>
        <Link href="/">
          <div className="img-link">
            <div className="img-box">
              <Image
                src="/stars.svg"
                alt="Quiz Generator"
                width={20}
                height={20}
              />
            </div>
            Quiz Generator
          </div>
        </Link>
        <Link href="/discover">
          <div className="img-link">
            <div className="img-box">
              <Image src="/utforsk.svg" alt="Discover" width={20} height={20} />
            </div>
            Utforskeren
          </div>
        </Link>
        <Link href="/min-profil">
          <div className="img-link">
            <div className="img-box"></div>
            Min side
          </div>
        </Link>
      </div>

      <div className="navbar-pic">
        <h2>Velkommen til Quizler!</h2>
        <Image
          src="/jente.png"
          alt="Quizler logo"
          width={350}
          height={100}
          className="navbar-pic-image"
        />
      </div>
      <LogoutButton />
      {/* Innhold vil bli lagt til av brukeren senere */}
    </nav>
  );
};

export default Navbar;
