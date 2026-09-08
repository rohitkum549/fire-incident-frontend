import React from "react";
import { useAuth } from "../auth/useAuth";
import { Shield, UserCheck, Key, Building2, BadgeCheck } from "lucide-react";

export const Profile: React.FC = () => {
  const { user } = useAuth();

  const formattedRole = (roles?: string[]): string => {
    if (!roles || roles.length === 0) return "Operator";
    const role = roles[0];
    if (role === "ROLE_ADMIN" || role === "ADMIN") return "Fire Administrator";
    if (role === "ROLE_FIREFIGHTER" || role === "FIREFIGHTER") return "Field Firefighter";
    if (role === "ROLE_CITIZEN" || role === "CITIZEN") return "Public Citizen";
    return role;
  };

  return (
    <main>
      <section className="profile-card">
        <div className="profile-header-row">
          <div className="profile-avatar-large">
            {(user?.name || user?.username || "U").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="metric-label">Active User Session</p>
            <h2>{user?.name || user?.username || "Anonymous Operator"}</h2>
            <span className="user-role-tag active-role">
              <Shield size={14} /> {formattedRole(user?.roles)}
            </span>
          </div>
        </div>

        <div className="profile-grid-details">
          <div className="profile-detail-card">
            <p className="card-label">
              <UserCheck size={14} /> Username
            </p>
            <p className="detail-value">{user?.username || user?.name || "N/A"}</p>
          </div>

          <div className="profile-detail-card">
            <p className="card-label">Email Address</p>
            <p className="detail-value">{user?.email || "N/A"}</p>
          </div>

          <div className="profile-detail-card">
            <p className="card-label">
              <BadgeCheck size={14} /> User ID / Employee Code
            </p>
            <p className="detail-value">{user?.employee_code || user?.id || "N/A"}</p>
          </div>

          <div className="profile-detail-card">
            <p className="card-label">
              <Building2 size={14} /> Assigned Station ID
            </p>
            <p className="detail-value">{user?.station_id || "Global Jurisdiction"}</p>
          </div>

          <div className="profile-detail-card full-width">
            <p className="card-label">
              <Key size={14} /> Authorization Token
            </p>
            <p className="detail-value token-text">
              {user?.token ? `${user.token.slice(0, 32)}...` : "Bearer Token Stored in Session"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
