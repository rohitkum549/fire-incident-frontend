import { fetchApi } from "../api/client";
import {
  Country,
  CreateCountryPayload,
  State,
  CreateStatePayload,
  City,
  CreateCityPayload,
} from "../types";

export const geographyService = {
  /**
   * Register Country
   * Endpoint: POST /geography/countries
   */
  async createCountry(payload: CreateCountryPayload): Promise<Country> {
    return await fetchApi<Country>("/geography/countries", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch All Countries
   * Endpoint: GET /geography/countries
   */
  async getCountries(): Promise<Country[]> {
    try {
      return await fetchApi<Country[]>("/geography/countries");
    } catch {
      return [{ id: "country-1", name: "United States", iso_code: "USA" }];
    }
  },

  /**
   * Register State
   * Endpoint: POST /geography/states
   */
  async createState(payload: CreateStatePayload): Promise<State> {
    return await fetchApi<State>("/geography/states", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch All States
   * Endpoint: GET /geography/states
   */
  async getStates(): Promise<State[]> {
    try {
      return await fetchApi<State[]>("/geography/states");
    } catch {
      return [{ id: "state-1", country_id: "country-1", name: "California", code: "CA" }];
    }
  },

  /**
   * Register City
   * Endpoint: POST /geography/cities
   */
  async createCity(payload: CreateCityPayload): Promise<City> {
    return await fetchApi<City>("/geography/cities", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch All Cities
   * Endpoint: GET /geography/cities
   */
  async getCities(): Promise<City[]> {
    try {
      return await fetchApi<City[]>("/geography/cities");
    } catch {
      return [{ id: "city-1", state_id: "state-1", name: "San Francisco" }];
    }
  },
};
