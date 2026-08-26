import React, { useEffect, useState } from "react";
import { DashboardCard } from "../components/ui/DashboardCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { EmptyState } from "../components/common/EmptyState";
import { incidentService } from "../services/incidentService";
import { DashboardMetric } from "../types";

export const Home: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await incidentService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMetrics();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading operational metrics..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadMetrics} />;
  }

  if (metrics.length === 0) {
    return (
      <EmptyState title="No Metrics Available" description="No active incident metrics recorded." />
    );
  }

  return (
    <main>
      <section className="metric-grid">
        {metrics.map((metric) => (
          <DashboardCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            caption={metric.caption}
          />
        ))}
      </section>
    </main>
  );
};

export default Home;
