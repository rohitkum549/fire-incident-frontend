import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div
      style={{
        padding: "1.5rem",
        backgroundColor: "#1f1315",
        border: "1px solid #7f1d1d",
        borderRadius: "8px",
        color: "#fca5a5",
        margin: "1rem 0",
      }}
      className="error-message-box"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <AlertTriangle style={{ width: 20, height: 20, color: "#ef4444" }} />
        <strong style={{ color: "#f87171" }}>Error</strong>
      </div>
      <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          style={{
            marginTop: "1rem",
            padding: "0.375rem 0.75rem",
            backgroundColor: "#dc2626",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      ) : null}
    </div>
  );
};
