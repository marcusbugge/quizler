import React from "react";
import Image from "next/image";

interface GenerateButtonProps {
  onClick: () => void;
  isCreating: boolean;
  isDisabled: boolean;
  text?: string;
  loadingText?: string;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  isCreating,
  isDisabled,
  text = "Opprett quiz",
  loadingText = "Oppretter...",
}) => {
  return (
    <button
      className="create-button"
      onClick={onClick}
      disabled={isCreating || isDisabled}
    >
      <Image
        src="/aistar.png"
        alt="Generate Stars"
        width={24}
        height={24}
        style={{ filter: "invert(1)" }}
      />
      <span>{isCreating ? loadingText : text}</span>
    </button>
  );
};

export default GenerateButton;
