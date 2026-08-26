import React from "react";
import { Activity, ArrowRight, ClipboardCheck, Flame, ShieldCheck, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNavbar } from "../components/layout/PublicNavbar";
import { useAuth } from "../auth/useAuth";

const features = [
  {
    icon: Activity,
    title: "Operational visibility",
    description:
      "Review dashboard metrics and the current state of your field equipment in one workspace.",
  },
  {
    icon: ClipboardCheck,
    title: "Inspection-ready records",
    description:
      "Keep asset locations, inspection dates, service notes, and work order details easy to find.",
  },
  {
    icon: Wrench,
    title: "Coordinated work",
    description:
      "Track planned work and support response coordination with a focused operational view.",
  },
];

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const primaryRoute = isAuthenticated ? "/home" : "/register";
  const primaryLabel = isAuthenticated ? "Open dashboard" : "Get started";

  return (
    <div className="landing-page" id="top">
      <PublicNavbar />
      <main>
        <section className="landing-hero" aria-labelledby="hero-title">
          <div className="landing-container hero-grid">
            <div className="hero-copy">
              <p className="section-kicker">
                <Flame size={16} /> Fire safety operations
              </p>
              <h1 id="hero-title">A clearer command centre for fire safety operations.</h1>
              <p className="hero-description">
                Fire System brings operational metrics, equipment records, service work, and field
                coordination together so teams can stay ready for the work in front of them.
              </p>
              <div className="hero-actions">
                <Link className="landing-button landing-button-primary" to={primaryRoute}>
                  {primaryLabel} <ArrowRight size={18} />
                </Link>
                {!isAuthenticated ? (
                  <Link className="landing-button landing-button-secondary" to="/login">
                    Sign in
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="hero-panel" aria-label="Fire System operational overview">
              <div className="hero-panel-top">
                <span>Operational overview</span>
                <span className="live-indicator">System ready</span>
              </div>
              <div className="hero-reading">
                <strong>Field readiness</strong>
                <span>Assets, work, and coordination in view</span>
              </div>
              <div className="hero-panel-grid">
                <div>
                  <span>Assets</span>
                  <strong>Tracked</strong>
                </div>
                <div>
                  <span>Work orders</span>
                  <strong>Organised</strong>
                </div>
                <div>
                  <span>Messages</span>
                  <strong>Connected</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="features" aria-labelledby="features-title">
          <div className="landing-container">
            <div className="section-intro">
              <p className="section-kicker">Core capabilities</p>
              <h2 id="features-title">The essentials for a better-prepared team.</h2>
            </div>
            <div className="feature-grid">
              {features.map(({ icon: Icon, title, description }) => (
                <article className="feature-card" key={title}>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="landing-section landing-overview"
          id="overview"
          aria-labelledby="overview-title"
        >
          <div className="landing-container overview-grid">
            <div>
              <p className="section-kicker">Built around real operations</p>
              <h2 id="overview-title">Information that supports the next safe decision.</h2>
            </div>
            <div className="overview-copy">
              <p>
                Move from scattered records to a shared view of fleet and equipment status, upcoming
                checks, assigned work, and field communication.
              </p>
              <p>
                The platform focuses on the operational activities your team already manages—without
                adding noise or making claims about systems that are not in your workflow.
              </p>
            </div>
          </div>
        </section>

        <section className="landing-section safety-section" aria-labelledby="safety-title">
          <div className="landing-container safety-content">
            <ShieldCheck size={34} aria-hidden="true" />
            <div>
              <p className="section-kicker">Reliable by design</p>
              <h2 id="safety-title">Designed for clarity when it matters.</h2>
              <p>
                Accessible navigation, focused screens, and centralized operational records help
                teams spend less time searching and more time acting.
              </p>
            </div>
          </div>
        </section>

        <section className="landing-cta" aria-labelledby="cta-title">
          <div className="landing-container cta-content">
            <div>
              <p className="section-kicker">Ready when your team is</p>
              <h2 id="cta-title">Bring fire safety operations into one clear workspace.</h2>
            </div>
            <div className="hero-actions">
              <Link className="landing-button landing-button-primary" to={primaryRoute}>
                {isAuthenticated ? "Go to dashboard" : "Create account"} <ArrowRight size={18} />
              </Link>
              {!isAuthenticated ? (
                <Link className="landing-button landing-button-secondary" to="/login">
                  Sign in
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <footer className="landing-footer">
        <div className="landing-container footer-content">
          <div>
            <strong>Fire System</strong>
            <p>Operational visibility for fire safety teams.</p>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#overview">Overview</a>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <p>© {new Date().getFullYear()} Fire System</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
