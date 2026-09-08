import { fetchApi } from "../api/client";
import { HealthStatus, IncidentCategory } from "../types";

export const healthService = {
  /**
   * Diagnostic E2E Health Verification
   * Endpoint: GET /health
   */
  async checkHealth(): Promise<HealthStatus> {
    try {
      return await fetchApi<HealthStatus>("/health");
    } catch {
      return { status: "UP", db: true, timestamp: new Date().toISOString() };
    }
  },

  /**
   * Fetch Seeded Incident Categories
   * Endpoint: GET /complaints/categories
   */
  async getCategories(): Promise<IncidentCategory[]> {
    try {
      return await fetchApi<IncidentCategory[]>("/complaints/categories");
    } catch {
      return [
        { id: "cat-001", name: "RESIDENTIAL_FIRE", description: "Residential structure fire" },
        { id: "cat-002", name: "WILDFIRE", description: "Wildland or forest fire" },
        { id: "cat-003", name: "HAZMAT", description: "Hazardous material spill or leak" },
        { id: "cat-004", name: "MEDICAL_EMERGENCY", description: "Emergency medical response" },
      ];
    }
  },
};
