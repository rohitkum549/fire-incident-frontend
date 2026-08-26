import React, { useEffect, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(754); // 00:12:34
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (totalSecs: number): string => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return [hrs, mins, secs].map((v) => v.toString().padStart(2, "0")).join(":");
  };

  const handleToggle = (): void => {
    setIsActive((prev) => !prev);
  };

  const handleReset = (): void => {
    setIsActive(false);
    setSeconds(0);
  };

  return (
    <main>
      <section className="detail-card">
        <p className="metric-label">Field timer</p>
        <h2>Active dispatch</h2>
        <div className="detail-grid">
          <div>
            <p className="card-label">Current timer</p>
            <p
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                fontFamily: "monospace",
                color: "#f87171",
              }}
            >
              {formatTime(seconds)}
            </p>
          </div>
          <div>
            <p className="card-label">Active status</p>
            <p>{isActive ? "Dispatch Active" : "Paused / Duty Ready"}</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button
            onClick={handleToggle}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: isActive ? "#991b1b" : "#16a34a",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {isActive ? <Pause size={16} /> : <Play size={16} />}
            {isActive ? "Pause Duty" : "Start Duty"}
          </button>
          <button
            onClick={handleReset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#374151",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <p className="card-copy" style={{ marginTop: "1.5rem" }}>
          Track critical response time for active work orders and support crew coordination.
        </p>
      </section>
    </main>
  );
};

export default Timer;
