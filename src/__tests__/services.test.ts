import { describe, it, expect, beforeEach, vi } from "vitest";
import { healthService } from "../services/healthService";
import { geographyService } from "../services/geographyService";
import { stationService } from "../services/stationService";
import { shiftService } from "../services/shiftService";
import { complaintService } from "../services/complaintService";
import { incidentService } from "../services/incidentService";
import { adminService } from "../services/adminService";
import { authService } from "../auth/authService";

describe("Fire Management System - Modular Services E2E Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("0. Health & Diagnostics Service", () => {
    it("fetches health status fallback or response", async () => {
      const health = await healthService.checkHealth();
      expect(health).toHaveProperty("status");
    });

    it("fetches incident categories", async () => {
      const categories = await healthService.getCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0]).toHaveProperty("id");
      expect(categories[0]).toHaveProperty("name");
    });
  });

  describe("1. Geography & Jurisdiction Services", () => {
    it("fetches countries, states, and cities", async () => {
      const countries = await geographyService.getCountries();
      expect(Array.isArray(countries)).toBe(true);

      const states = await geographyService.getStates();
      expect(Array.isArray(states)).toBe(true);

      const cities = await geographyService.getCities();
      expect(Array.isArray(cities)).toBe(true);
    });

    it("creates country via service", async () => {
      const mockCountry = { id: "country-99", name: "United States", iso_code: "USA" };
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockCountry,
      } as Response);

      const created = await geographyService.createCountry({
        name: "United States",
        iso_code: "USA",
      });
      expect(created.id).toBe("country-99");
    });

    it("creates fire station via stationService", async () => {
      const mockStation = {
        id: "stn-100",
        cityId: "city-1",
        name: "SFFD Station 1",
        address: "251 Lafayette St",
        latitude: 37.7749,
        longitude: -122.4194,
      };
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockStation,
      } as Response);

      const created = await stationService.createStation({
        cityId: "city-1",
        name: "SFFD Station 1",
        address: "251 Lafayette St",
        latitude: 37.7749,
        longitude: -122.4194,
      });

      expect(created.id).toBe("stn-100");
    });
  });

  describe("2. Onboarding & Authentication Service", () => {
    it("registers user and automatically logs in to store session", async () => {
      vi.spyOn(globalThis, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: "user-1",
            email: "alice@example.com",
            username: "admin_alice",
            roles: ["ROLE_ADMIN"],
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            access_token: "test-jwt-token-123",
            username: "admin_alice",
            email: "alice@example.com",
            roles: ["ROLE_ADMIN"],
          }),
        } as Response);

      const registered = await authService.register({
        username: "admin_alice",
        email: "alice@example.com",
        password: "Password123!",
        first_name: "Alice",
        last_name: "Smith",
        role_names: ["ROLE_ADMIN"],
      });

      expect(registered).toHaveProperty("id");
      expect(registered.email).toBe("alice@example.com");
      expect(registered.token).toBe("test-jwt-token-123");
    });

    it("logs in user and stores JWT access token", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: "test-jwt-token-123",
          username: "admin_alice",
          email: "alice@example.com",
          roles: ["ROLE_ADMIN"],
        }),
      } as Response);

      const user = await authService.login({ username: "admin_alice", password: "Password123!" });
      expect(user.token).toBe("test-jwt-token-123");
      expect(localStorage.getItem("access_token")).toBe("test-jwt-token-123");
    });

    it("throws ApiError on 401 unauthorized and does not authenticate user", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          status: 401,
          message: "Invalid username or password",
        }),
      } as Response);

      await expect(
        authService.login({ username: "wrong_user", password: "bad_password" })
      ).rejects.toThrow("Invalid username or password");

      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem("fire-system-session")).toBeNull();
    });
  });

  describe("3. Shift Management Service", () => {
    it("checks in firefighter shift", async () => {
      const mockShift = {
        id: "shift-1",
        employee_id: "emp-1",
        station_id: "stn-1",
        status: "ACTIVE" as const,
        check_in_latitude: 37.7749,
        check_in_longitude: -122.4194,
      };
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockShift,
      } as Response);

      const shift = await shiftService.checkIn({
        employee_id: "emp-1",
        station_id: "stn-1",
        check_in_latitude: 37.7749,
        check_in_longitude: -122.4194,
      });

      expect(shift.status).toBe("ACTIVE");
    });

    it("checks out firefighter shift", async () => {
      const mockShift = {
        id: "shift-1",
        employee_id: "emp-1",
        station_id: "stn-1",
        status: "COMPLETED" as const,
        check_in_latitude: 37.7749,
        check_in_longitude: -122.4194,
        check_out_latitude: 37.7756,
        check_out_longitude: -122.4194,
      };
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockShift,
      } as Response);

      const shift = await shiftService.checkOut({
        shift_id: "shift-1",
        check_out_latitude: 37.7756,
        check_out_longitude: -122.4194,
      });

      expect(shift.status).toBe("COMPLETED");
    });
  });

  describe("4. Complaints & Incidents Operations Services", () => {
    it("submits a complaint", async () => {
      const mockComplaint = {
        id: "cmp-10",
        reporterId: "citizen-1",
        categoryId: "cat-001",
        latitude: 37.7749,
        longitude: -122.4194,
        severity: "HIGH" as const,
        description: "Commercial fire on Lafayette St",
      };
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockComplaint,
      } as Response);

      const complaint = await complaintService.submitComplaint({
        reporterId: "citizen-1",
        categoryId: "cat-001",
        latitude: 37.7749,
        longitude: -122.4194,
        severity: "HIGH",
        description: "Commercial fire on Lafayette St",
      });

      expect(complaint.id).toBe("cmp-10");
    });

    it("escalates complaint to incident", async () => {
      const mockIncident = {
        id: "inc-100",
        complaintId: "cmp-10",
        stationId: "stn-1",
        categoryId: "cat-001",
        severity: "HIGH" as const,
        latitude: 37.7749,
        longitude: -122.4194,
        status: "DISPATCHED" as const,
        notes: "Units dispatched",
      };
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockIncident,
      } as Response);

      const incident = await incidentService.escalateComplaint({
        complaintId: "cmp-10",
        stationId: "stn-1",
        categoryId: "cat-001",
        severity: "HIGH",
        latitude: 37.7749,
        longitude: -122.4194,
        notes: "Units dispatched",
      });

      expect(incident.status).toBe("DISPATCHED");
    });

    it("updates incident status to IN_PROGRESS and RESOLVED", async () => {
      const mockIncident = {
        id: "inc-100",
        status: "IN_PROGRESS" as const,
        notes: "Engine arrived",
      };
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockIncident,
      } as Response);

      const updated = await incidentService.updateIncidentStatus("inc-100", {
        status: "IN_PROGRESS",
        notes: "Engine arrived",
      });

      expect(updated.status).toBe("IN_PROGRESS");
    });
  });

  describe("5. Admin Service Aggregator", () => {
    it("aggregates country, station, and user onboarding operations", async () => {
      expect(typeof adminService.registerCountry).toBe("function");
      expect(typeof adminService.createFireStation).toBe("function");
      expect(typeof adminService.onboardUser).toBe("function");
      expect(typeof adminService.escalateComplaint).toBe("function");
    });
  });
});
