import React from "react";

interface SuccessMessageProps {
  message: string | null;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        backgroundColor: "#E8F5E9",
        color: "#2E7D32",
        padding: "12px 16px",
        borderRadius: "4px",
        marginBottom: "15px",
        borderLeft: "4px solid #2E7D32",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: "8px" }}
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      {message}
    </div>
  );
};

export default SuccessMessage;
