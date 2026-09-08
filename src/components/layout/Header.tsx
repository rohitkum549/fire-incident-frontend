import React from "react";
import { Flame, UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { envConfig } from "../../config/env";
import { useAuth } from "../../auth/useAuth";

interface HeaderProps {
  subtitle?: string;
}

const getInitials = (name?: string): string => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  const p0 = parts[0]?.[0] || "";
  const p1 = parts[1]?.[0] || "";
  if (p0 && p1) {
    return `${p0}${p1}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const formatRole = (roles?: string[]): string => {
  if (!roles || roles.length === 0 || !roles[0]) return "Operator";
  const role = roles[0];
  if (role === "ROLE_ADMIN" || role === "ADMIN") return "Administrator";
  if (role === "ROLE_FIREFIGHTER" || role === "FIREFIGHTER") return "Firefighter";
  if (role === "ROLE_CITIZEN" || role === "CITIZEN") return "Citizen Reporter";
  return role.replace(/^ROLE_/, "");
};

export const Header: React.FC<HeaderProps> = ({ subtitle }) => {
  const { user } = useAuth();

  return (
    <header className="app-header">
      <div className="header-top-bar">
        <div className="brand-row">
          <div className="brand-mark header-mark">
            <Flame size={18} />
          </div>
          <div>
            <p className="eyebrow">Operational Command</p>
            <h1>{envConfig.appName}</h1>
          </div>
        </div>

        {user ? (
          <div className="header-actions-group">
            <Link to="/profile" className="header-user-badge" title="Click to view profile">
              <div className="user-avatar-circle">
                {getInitials(user.name || user.username || user.email)}
              </div>
              <div className="user-info-text">
                <span className="user-display-name">{user.name || user.username}</span>
                <span className="user-role-tag">{formatRole(user.roles)}</span>
              </div>
            </Link>
          </div>
        ) : (
          <Link to="/login" className="header-user-badge login-badge">
            <UserCircle2 size={24} />
            <span>Sign In</span>
          </Link>
        )}
      </div>

      {subtitle ? <p className="header-subtitle">{subtitle}</p> : null}
    </header>
  );
};
