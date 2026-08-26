import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ label = "Loading data..." }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1rem",
        gap: "0.75rem",
      }}
      className="loading-container"
    >
      <Loader2
        className="animate-spin"
        style={{ width: 28, height: 28, color: "#dc2626", animation: "spin 1s linear infinite" }}
      />
      <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>{label}</p>
    </div>
  );
};
