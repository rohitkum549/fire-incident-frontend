import React, { useState } from "react";
import { SettingItem } from "../types";

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingItem[]>([
    {
      id: "s1",
      label: "Push Notifications",
      value: "Alerts for critical dispatches",
      enabled: true,
    },
    {
      id: "s2",
      label: "Two-Factor Authentication",
      value: "Secured hardware key required",
      enabled: true,
    },
    {
      id: "s3",
      label: "Auto-update Field Maps",
      value: "Automatic offline GIS caching",
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string): void => {
    setSettings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  return (
    <main>
      <section className="settings-card">
        <p className="metric-label">Settings</p>
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="settings-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem 0",
            }}
          >
            <div>
              <p className="settings-label">{setting.label}</p>
              <p className="settings-copy">{setting.value}</p>
            </div>
            <button
              onClick={() => toggleSetting(setting.id)}
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "12px",
                border: "none",
                backgroundColor: setting.enabled ? "#16a34a" : "#4b5563",
                color: "#ffffff",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              {setting.enabled ? "Enabled" : "Disabled"}
            </button>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Settings;
