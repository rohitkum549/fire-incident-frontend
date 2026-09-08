import { geographyService } from "./geographyService";
import { stationService } from "./stationService";
import { authService } from "../auth/authService";
import { incidentService } from "./incidentService";
import {
  Country,
  CreateCountryPayload,
  State,
  CreateStatePayload,
  City,
  CreateCityPayload,
  FireStation,
  CreateStationPayload,
  Incident,
  EscalateComplaintPayload,
} from "../types";
import { AuthUser, RegistrationValues } from "../auth/types";

export const adminService = {
  /**
   * Register Country
   */
  async registerCountry(payload: CreateCountryPayload): Promise<Country> {
    return await geographyService.createCountry(payload);
  },

  /**
   * Register State
   */
  async registerState(payload: CreateStatePayload): Promise<State> {
    return await geographyService.createState(payload);
  },

  /**
   * Register City
   */
  async registerCity(payload: CreateCityPayload): Promise<City> {
    return await geographyService.createCity(payload);
  },

  /**
   * Create Fire Station
   */
  async createFireStation(payload: CreateStationPayload): Promise<FireStation> {
    return await stationService.createStation(payload);
  },

  /**
   * Onboard Staff / User (Admin, Firefighter, or Citizen)
   */
  async onboardUser(values: RegistrationValues): Promise<AuthUser> {
    return await authService.register(values);
  },

  /**
   * Escalate Complaint to Incident
   */
  async escalateComplaint(payload: EscalateComplaintPayload): Promise<Incident> {
    return await incidentService.escalateComplaint(payload);
  },
};
