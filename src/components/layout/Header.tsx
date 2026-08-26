import React from "react";
import { Flame } from "lucide-react";
import { envConfig } from "../../config/env";

interface HeaderProps {
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ subtitle }) => {
  return (
    <header className="app-header">
      <div className="brand-row">
        <div className="brand-mark header-mark">
          <Flame size={18} />
        </div>
        <div>
          <p className="eyebrow">Operational Command</p>
          <h1>{envConfig.appName}</h1>
        </div>
      </div>

      {subtitle ? <p className="header-subtitle">{subtitle}</p> : null}
    </header>
  );
};
