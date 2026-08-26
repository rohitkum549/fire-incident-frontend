import React, { useState } from "react";
import { Flame, Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

const sectionLinks = [
  { label: "Home", target: "top" },
  { label: "Features", target: "features" },
  { label: "Overview", target: "overview" },
];

export const PublicNavbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = (): void => setMenuOpen(false);
  const scrollToSection = (target: string): void => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    closeMenu();
  };
  const handleLogout = (): void => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="public-header">
      <nav className="public-nav" aria-label="Main navigation">
        <Link className="public-brand" to="/" onClick={() => scrollToSection("top")}>
          <span className="public-brand-mark" aria-hidden="true">
            <Flame size={20} />
          </span>
          <span>Fire System</span>
        </Link>

        <button
          className="nav-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="public-navigation"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`public-nav-actions${menuOpen ? " is-open" : ""}`} id="public-navigation">
          {sectionLinks.map(({ label, target }) => (
            <button
              key={target}
              type="button"
              className="public-nav-link"
              onClick={() => scrollToSection(target)}
            >
              {label}
            </button>
          ))}
          {isAuthenticated ? (
            <>
              <NavLink to="/home" className="public-nav-link" onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className="public-nav-link" onClick={closeMenu}>
                Profile
              </NavLink>
              <button type="button" className="public-nav-link" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="public-nav-link" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="public-nav-cta" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
