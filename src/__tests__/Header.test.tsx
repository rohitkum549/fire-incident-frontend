import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Header } from "../components/layout/Header";

describe("Header component", () => {
  it("renders app name and subtitle", () => {
    render(<Header subtitle="Test Subtitle Description" />);
    expect(screen.getByText("Operational Command")).toBeInTheDocument();
    expect(screen.getByText("Test Subtitle Description")).toBeInTheDocument();
  });
});
