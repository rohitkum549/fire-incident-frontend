import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../auth/AuthProvider";
import { Header } from "../components/layout/Header";

describe("Header component", () => {
  it("renders app name and subtitle", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Header subtitle="Test Subtitle Description" />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText("Operational Command")).toBeInTheDocument();
    expect(screen.getByText("Test Subtitle Description")).toBeInTheDocument();
  });
});
