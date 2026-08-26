import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { incidentService } from "../services/incidentService";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { EmptyState } from "../components/common/EmptyState";
import { Asset } from "../types";

export const AssetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const parsedId = id ? parseInt(id, 10) : NaN;

  const fetchDetails = React.useCallback(async (): Promise<void> => {
    if (isNaN(parsedId)) {
      setError("Invalid Asset ID specified");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await incidentService.getAssetById(parsedId);
      setAsset(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load asset details");
    } finally {
      setLoading(false);
    }
  }, [parsedId]);

  useEffect(() => {
    void fetchDetails();
  }, [fetchDetails]);

  if (loading) {
    return <LoadingSpinner label="Loading asset details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDetails} />;
  }

  if (!asset) {
    return (
      <EmptyState
        title="Asset Not Found"
        description={`No asset record matching ID ${id ?? ""}.`}
      />
    );
  }

  return (
    <main>
      <section className="detail-card">
        <div style={{ marginBottom: "1rem" }}>
          <Link
            to="/assets"
            style={{ color: "#dc2626", textDecoration: "none", fontSize: "0.875rem" }}
          >
            &larr; Back to Assets
          </Link>
        </div>
        <p className="metric-label">Asset details</p>
        <h2>{asset.name}</h2>
        <div className="detail-grid">
          <div>
            <p className="card-label">Status</p>
            <span
              className={`status-pill ${
                asset.status === "Available"
                  ? "status-safe"
                  : asset.status === "In Service"
                    ? "status-warning"
                    : "status-danger"
              }`}
            >
              {asset.status}
            </span>
          </div>
          <div>
            <p className="card-label">Location</p>
            <p>{asset.location}</p>
          </div>
          <div>
            <p className="card-label">Next inspection</p>
            <p>{asset.nextInspection ?? "N/A"}</p>
          </div>
        </div>
        {asset.notes ? <p className="card-copy">{asset.notes}</p> : null}
      </section>
    </main>
  );
};

export default AssetDetails;
