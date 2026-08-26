import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, describe, it, expect } from "vitest";
import App from "../App";
import { AuthProvider } from "../auth/AuthProvider";

describe("App Integration", () => {
  afterEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("renders the landing page as the public entry point", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: /clearer command centre/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Register" }).length).toBeGreaterThan(0);
  });

  it("redirects unauthenticated visitors away from protected pages", () => {
    window.history.pushState({}, "", "/home");
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
  });
});
