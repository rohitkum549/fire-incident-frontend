import React from "react";
import { Link } from "react-router-dom";
import { AssetStatus } from "../../types";

interface AssetCardProps {
  id?: number;
  name: string;
  status: AssetStatus;
  details: string;
}

export const AssetCard: React.FC<AssetCardProps> = ({ id, name, status, details }) => {
  const content = (
    <article className="asset-card">
      <div>
        <p className="asset-name">{name}</p>
        <p className="asset-details">{details}</p>
      </div>
      <span
        className={`status-pill ${
          status === "Available"
            ? "status-safe"
            : status === "In Service"
              ? "status-warning"
              : "status-danger"
        }`}
      >
        {status}
      </span>
    </article>
  );

  if (id !== undefined) {
    return (
      <Link to={`/assets/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        {content}
      </Link>
    );
  }

  return content;
};
