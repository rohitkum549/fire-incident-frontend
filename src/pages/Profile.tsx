import React from "react";
import { User } from "../types";

export const Profile: React.FC = () => {
  const user: User = {
    id: "usr_9021",
    name: "Alex Reyes",
    role: "Operations Manager",
    email: "alex.reyes@fireops.com",
  };

  return (
    <main>
      <section className="profile-card">
        <p className="metric-label">Profile</p>
        <h2>{user.name}</h2>
        <div className="profile-row">
          <div>
            <p className="card-label">Role</p>
            <p>{user.role}</p>
          </div>
          <div>
            <p className="card-label">Officer ID</p>
            <p>{user.id}</p>
          </div>
          <div>
            <p className="card-label">Email</p>
            <p>{user.email}</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
