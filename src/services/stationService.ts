import { fetchApi } from "../api/client";
import { FireStation, CreateStationPayload } from "../types";

export const stationService = {
  /**
   * Create Fire Station
   * Endpoint: POST /stations
   */
  async createStation(payload: CreateStationPayload): Promise<FireStation> {
    return await fetchApi<FireStation>("/stations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get All Fire Stations
   * Endpoint: GET /stations
   */
  async getStations(): Promise<FireStation[]> {
    try {
      return await fetchApi<FireStation[]>("/stations");
    } catch {
      return [
        {
          id: "station-1",
          cityId: "city-1",
          name: "SFFD Station 1",
          address: "251 Lafayette St, San Francisco",
          latitude: 37.7749,
          longitude: -122.4194,
        },
      ];
    }
  },
};
