import React, { useState } from "react";
import { ArrowLeft, Flame } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

interface LocationState {
  from?: string;
}

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const from = (location.state as LocationState | null)?.from || "/home";

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ username, password });
      navigate(from, { replace: true });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to sign in. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <Link className="back-link" to="/">
          <ArrowLeft size={16} /> Back to Fire System
        </Link>
        <div className="login-logo">
          <Flame size={25} aria-hidden="true" />
        </div>
        <div className="login-heading">
          <p className="section-kicker">Secure access</p>
          <h1 id="login-title">Welcome back</h1>
          <p>Sign in to access your Fire System operational workspace.</p>
        </div>
        {error ? (
          <div className="form-error" role="alert">
            {error}
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="input-group">
            <label htmlFor="username-input">Username or email</label>
            <div className="input-wrapper">
              <input
                id="username-input"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username or email"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="password-input">Password</label>
            <div className="input-wrapper">
              <input
                id="password-input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="login-bottom">
          New to Fire System? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
