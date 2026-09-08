import React, { useState, useEffect } from "react";
import { ArrowLeft, Flame, Shield, User, FlameKindling, Building, BadgeCheck } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { stationService } from "../services/stationService";
import { FireStation } from "../types";

export const Register: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<
    "ROLE_CITIZEN" | "ROLE_FIREFIGHTER" | "ROLE_ADMIN"
  >("ROLE_CITIZEN");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stationId, setStationId] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [stations, setStations] = useState<FireStation[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  const isEmployee = selectedRole === "ROLE_FIREFIGHTER" || selectedRole === "ROLE_ADMIN";

  useEffect(() => {
    stationService
      .getStations()
      .then((list) => {
        setStations(list);
        const firstStation = list[0];
        if (firstStation) {
          setStationId((prev) => prev || firstStation.id);
        }
      })
      .catch(() => {
        // Gracefully handle offline or unseeded stations
      });
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (isEmployee) {
      if (!stationId.trim()) {
        setError("Fire station selection is required for staff registration.");
        return;
      }
      if (!employeeCode.trim()) {
        setError("Employee code (e.g., EMP-00001) is required for staff registration.");
        return;
      }
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phoneNumber.trim() || "+15550100",
        role_names: [selectedRole],
        ...(isEmployee ? { station_id: stationId.trim(), employee_code: employeeCode.trim() } : {}),
      });

      navigate("/home", { replace: true });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to create account. Please verify input fields."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card register-extended-card" aria-labelledby="register-title">
        <Link className="back-link" to="/">
          <ArrowLeft size={16} /> Back to Fire System
        </Link>
        <div className="login-logo">
          <Flame size={25} aria-hidden="true" />
        </div>
        <div className="login-heading">
          <p className="section-kicker">Account Registration</p>
          <h1 id="register-title">Create your workspace identity</h1>
          <p>Select your account role to access relevant operational capabilities.</p>
        </div>

        {/* Role Picker Selector */}
        <div className="role-selector-grid" role="radiogroup" aria-label="Account Role Selection">
          <button
            type="button"
            className={`role-option-card${selectedRole === "ROLE_CITIZEN" ? " active" : ""}`}
            onClick={() => setSelectedRole("ROLE_CITIZEN")}
          >
            <User className="role-icon" size={20} />
            <div className="role-text">
              <strong>Citizen</strong>
              <small>Public incident reporting</small>
            </div>
          </button>

          <button
            type="button"
            className={`role-option-card${selectedRole === "ROLE_FIREFIGHTER" ? " active" : ""}`}
            onClick={() => setSelectedRole("ROLE_FIREFIGHTER")}
          >
            <FlameKindling className="role-icon" size={20} />
            <div className="role-text">
              <strong>Firefighter</strong>
              <small>Shift & emergency response</small>
            </div>
          </button>

          <button
            type="button"
            className={`role-option-card${selectedRole === "ROLE_ADMIN" ? " active" : ""}`}
            onClick={() => setSelectedRole("ROLE_ADMIN")}
          >
            <Shield className="role-icon" size={20} />
            <div className="role-text">
              <strong>Station Admin</strong>
              <small>Dispatch & geography setup</small>
            </div>
          </button>
        </div>

        {error ? (
          <div className="form-error" role="alert">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-row-2col">
            <div className="input-group">
              <label htmlFor="username-input">Username</label>
              <div className="input-wrapper">
                <input
                  id="username-input"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    selectedRole === "ROLE_ADMIN"
                      ? "admin_alice"
                      : selectedRole === "ROLE_FIREFIGHTER"
                        ? "firefighter_bob"
                        : "citizen_jane"
                  }
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email-input">Work Email</label>
              <div className="input-wrapper">
                <input
                  id="email-input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row-2col">
            <div className="input-group">
              <label htmlFor="firstname-input">First Name</label>
              <div className="input-wrapper">
                <input
                  id="firstname-input"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="lastname-input">Last Name</label>
              <div className="input-wrapper">
                <input
                  id="lastname-input"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="phone-input">Phone Number</label>
            <div className="input-wrapper">
              <input
                id="phone-input"
                type="tel"
                autoComplete="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+15550100"
              />
            </div>
          </div>

          {/* Conditional Fields for Employees (Admin & Firefighter) */}
          {isEmployee ? (
            <div className="employee-fields-panel">
              <div className="panel-badge-label">
                <Building size={14} /> Station Employee Profile Requirements
              </div>

              <div className="form-row-2col">
                <div className="input-group">
                  <label htmlFor="station-select">Assigned Fire Station</label>
                  <div className="input-wrapper">
                    {stations.length > 0 ? (
                      <select
                        id="station-select"
                        className="custom-select-input"
                        value={stationId}
                        onChange={(e) => setStationId(e.target.value)}
                      >
                        {stations.map((stn) => (
                          <option key={stn.id} value={stn.id}>
                            {stn.name} ({stn.address})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="station-select"
                        type="text"
                        value={stationId}
                        onChange={(e) => setStationId(e.target.value)}
                        placeholder="Enter Station UUID (e.g. from station setup)"
                      />
                    )}
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="empcode-input">
                    <BadgeCheck size={14} /> Employee Code
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="empcode-input"
                      type="text"
                      value={employeeCode}
                      onChange={(e) => setEmployeeCode(e.target.value)}
                      placeholder="e.g. EMP-00001 or EMP-99881"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="form-row-2col">
            <div className="input-group">
              <label htmlFor="new-password-input">Password</label>
              <div className="input-wrapper">
                <input
                  id="new-password-input"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirm-password-input">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  id="confirm-password-input"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting
              ? "Creating Account…"
              : `Register as ${selectedRole === "ROLE_ADMIN" ? "Admin" : selectedRole === "ROLE_FIREFIGHTER" ? "Firefighter" : "Citizen"}`}
          </button>
        </form>

        <p className="login-bottom">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
