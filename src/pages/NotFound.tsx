import React from "react";
import { Link } from "react-router-dom";

export const NotFound: React.FC = () => {
  return (
    <main style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
      <section className="detail-card">
        <p className="metric-label">404 - Not Found</p>
        <h2>Page Does Not Exist</h2>
        <p className="card-copy" style={{ marginBottom: "1.5rem" }}>
          The requested command page or route could not be located.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            backgroundColor: "#dc2626",
            color: "#ffffff",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Return to Fire System
        </Link>
      </section>
    </main>
  );
};

export default NotFound;
