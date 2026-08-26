import React from "react";

interface DashboardCardProps {
  title: string;
  value: string;
  caption?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, caption }) => {
  return (
    <article className="metric-card">
      <p className="metric-label">{title}</p>
      <p className="metric-value">{value}</p>
      {caption ? <p className="metric-caption">{caption}</p> : null}
    </article>
  );
};
