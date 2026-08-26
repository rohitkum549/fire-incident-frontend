import { describe, it, expect } from "vitest";
import { incidentService } from "../services/incidentService";

describe("incidentService", () => {
  it("fetches dashboard metrics successfully", async () => {
    const metrics = await incidentService.getDashboardMetrics();
    expect(Array.isArray(metrics)).toBe(true);
    expect(metrics.length).toBeGreaterThan(0);
    expect(metrics[0]).toHaveProperty("title");
  });

  it("fetches asset inventory list", async () => {
    const assets = await incidentService.getAssets();
    expect(Array.isArray(assets)).toBe(true);
    expect(assets.length).toBeGreaterThan(0);
  });

  it("returns asset by ID", async () => {
    const asset = await incidentService.getAssetById(1);
    expect(asset).not.toBeNull();
    expect(asset?.name).toBe("Engine 5");
  });
});
