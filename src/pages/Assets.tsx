import React, { useEffect, useState } from "react";
import { AssetCard } from "../components/ui/AssetCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { EmptyState } from "../components/common/EmptyState";
import { incidentService } from "../services/incidentService";
import { Asset } from "../types";

export const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await incidentService.getAssets();
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load asset inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAssets();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading equipment assets..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadAssets} />;
  }

  if (assets.length === 0) {
    return (
      <EmptyState
        title="No Assets Found"
        description="No equipment assets are currently registered."
      />
    );
  }

  return (
    <main>
      <section className="asset-grid">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            id={asset.id}
            name={asset.name}
            status={asset.status}
            details={asset.details}
          />
        ))}
      </section>
    </main>
  );
};

export default Assets;
