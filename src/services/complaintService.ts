import { fetchApi } from "../api/client";
import { Complaint, SubmitComplaintPayload, IncidentCategory } from "../types";

export const complaintService = {
  /**
   * Fetch Incident Categories
   * Endpoint: GET /complaints/categories
   */
  async getCategories(): Promise<IncidentCategory[]> {
    try {
      return await fetchApi<IncidentCategory[]>("/complaints/categories");
    } catch {
      return [
        { id: "cat-001", name: "RESIDENTIAL_FIRE", description: "Residential structure fire" },
        { id: "cat-002", name: "WILDFIRE", description: "Wildland or forest fire" },
        { id: "cat-003", name: "HAZMAT", description: "Hazardous material spill" },
        { id: "cat-004", name: "MEDICAL_EMERGENCY", description: "Medical emergency response" },
      ];
    }
  },

  /**
   * Submit Citizen Complaint
   * Endpoint: POST /complaints
   */
  async submitComplaint(payload: SubmitComplaintPayload): Promise<Complaint> {
    return await fetchApi<Complaint>("/complaints", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch All Complaints
   * Endpoint: GET /complaints
   */
  async getComplaints(): Promise<Complaint[]> {
    try {
      return await fetchApi<Complaint[]>("/complaints");
    } catch {
      return [];
    }
  },
};
