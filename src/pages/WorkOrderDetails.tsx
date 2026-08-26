import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { incidentService } from "../services/incidentService";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { EmptyState } from "../components/common/EmptyState";
import { WorkOrder } from "../types";

export const WorkOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const parsedId = id ? parseInt(id, 10) : NaN;

  const loadOrder = React.useCallback(async (): Promise<void> => {
    if (isNaN(parsedId)) {
      setError("Invalid Work Order ID specified");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await incidentService.getWorkOrderById(parsedId);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load work order details");
    } finally {
      setLoading(false);
    }
  }, [parsedId]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  if (loading) {
    return <LoadingSpinner label="Loading work order details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadOrder} />;
  }

  if (!order) {
    return (
      <EmptyState title="Order Not Found" description={`Work order #${id ?? ""} does not exist.`} />
    );
  }

  return (
    <main>
      <section className="detail-card">
        <div style={{ marginBottom: "1rem" }}>
          <Link
            to="/work-orders"
            style={{ color: "#dc2626", textDecoration: "none", fontSize: "0.875rem" }}
          >
            &larr; Back to Work Orders
          </Link>
        </div>
        <p className="metric-label">Work order details</p>
        <h2>{order.title}</h2>
        <div className="detail-grid">
          <div>
            <p className="card-label">Order ID</p>
            <p>{order.id}</p>
          </div>
          <div>
            <p className="card-label">Assigned</p>
            <p>{order.assignedTo}</p>
          </div>
          <div>
            <p className="card-label">Due date</p>
            <p>{order.due}</p>
          </div>
          <div>
            <p className="card-label">Location</p>
            <p>{order.location}</p>
          </div>
        </div>
        <p className="card-copy">{order.description}</p>
      </section>
    </main>
  );
};

export default WorkOrderDetails;
