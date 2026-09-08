export type UserRoleName = "ROLE_ADMIN" | "ROLE_FIREFIGHTER" | "ROLE_CITIZEN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  roles?: string[];
  station_id?: string;
  employee_code?: string;
  token?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegistrationValues {
  username?: string;
  email: string;
  password: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role_names?: string[];
  station_id?: string;
  employee_code?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
  id?: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  roles?: string[];
  station_id?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  roles?: string[];
  created_at?: string;
}
