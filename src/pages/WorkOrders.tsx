import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { incidentService } from "../services/incidentService";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { EmptyState } from "../components/common/EmptyState";
import { WorkOrder } from "../types";

export const WorkOrders: React.FC = () => {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await incidentService.getWorkOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load work orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading service work orders..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadOrders} />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No Work Orders"
        description="There are currently no active service work orders."
      />
    );
  }

  return (
    <main>
      <section className="order-grid">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/work-orders/${order.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <article className="work-card">
              <p className="metric-label">Work order #{order.id}</p>
              <strong>{order.title}</strong>
              <p className="order-copy">Due: {order.due}</p>
              <div className="work-status">
                <span>{order.status}</span>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default WorkOrders;
