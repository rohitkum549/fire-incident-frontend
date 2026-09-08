import { fetchApi } from "../api/client";
import { Shift, ShiftCheckInPayload, ShiftCheckOutPayload } from "../types";

export const shiftService = {
  /**
   * Shift Check-in
   * Endpoint: POST /shifts/check-in
   */
  async checkIn(payload: ShiftCheckInPayload): Promise<Shift> {
    return await fetchApi<Shift>("/shifts/check-in", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Shift Check-out
   * Endpoint: PATCH /shifts/check-out
   */
  async checkOut(payload: ShiftCheckOutPayload): Promise<Shift> {
    return await fetchApi<Shift>("/shifts/check-out", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get All Shifts
   * Endpoint: GET /shifts
   */
  async getShifts(): Promise<Shift[]> {
    try {
      return await fetchApi<Shift[]>("/shifts");
    } catch {
      return [];
    }
  },
};
