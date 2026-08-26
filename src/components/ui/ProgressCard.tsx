import React from "react";

interface ProgressCardProps {
  title: string;
  percent?: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ title, percent = 0 }) => {
  const safePercent = Math.max(0, Math.min(100, percent));
  const width = `${safePercent}%`;

  return (
    <div className="stat-card">
      <p className="text-[10px] text-zinc-400">{title}</p>
      <div style={{ marginTop: 8 }}>
        <div
          style={{
            background: "#0b1220",
            borderRadius: 8,
            height: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width,
              background: "#dc2626",
              height: "100%",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <div className="text-xs text-zinc-400" style={{ marginTop: 6 }}>
          {safePercent}%
        </div>
      </div>
    </div>
  );
};
