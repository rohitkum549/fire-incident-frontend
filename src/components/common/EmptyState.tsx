import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data available",
  description = "There are currently no items to display in this view.",
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        textAlign: "center",
      }}
      className="empty-state-box"
    >
      <FolderOpen style={{ width: 40, height: 40, color: "#6b7280", marginBottom: "0.75rem" }} />
      <h3 style={{ fontSize: "1.125rem", color: "#e5e7eb", marginBottom: "0.25rem" }}>{title}</h3>
      <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>{description}</p>
    </div>
  );
};
