"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./navbar/Navbar";
import { shouldShowNavbar } from "../utils/navigationConfig";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const showNavbar = shouldShowNavbar(pathname);

  if (!showNavbar) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default ConditionalLayout;
