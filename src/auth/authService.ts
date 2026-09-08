import { fetchApi, ApiError } from "../api/client";
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  RegistrationValues,
  RegisterResponse,
} from "./types";

const SESSION_KEY = "fire-system-session";
const TOKEN_KEY = "access_token";

const readSession = (): AuthUser | null => {
  try {
    const storedSession = window.localStorage.getItem(SESSION_KEY);
    if (!storedSession) {
      return null;
    }

    const session = JSON.parse(storedSession) as AuthUser;
    return session.id && (session.name || session.username || session.email) ? session : null;
  } catch {
    return null;
  }
};

const saveSession = (user: AuthUser, token?: string): void => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
};

export const authService = {
  getSession(): AuthUser | null {
    return readSession();
  },

  getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  },

  async login({ username, password }: LoginCredentials): Promise<AuthUser> {
    if (!username.trim() || !password.trim()) {
      throw new Error("Enter both your username or email and password.");
    }

    try {
      const response = await fetchApi<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const displayName =
        response.first_name || response.last_name
          ? `${response.first_name || ""} ${response.last_name || ""}`.trim()
          : response.username || username.trim().split("@")[0] || "Operator";

      const user: AuthUser = {
        id: response.id || `user-${Date.now()}`,
        name: displayName,
        email:
          response.email ||
          (username.includes("@") ? username.trim() : `${displayName}@fire-system.local`),
        username: response.username || username.trim(),
        roles: response.roles || ["ROLE_CITIZEN"],
        station_id: response.station_id,
        token: response.access_token,
      };

      saveSession(user, response.access_token);
      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (
        error instanceof Error &&
        (error.message.includes("Failed to fetch") || error.message.includes("network"))
      ) {
        throw new Error(
          "Unable to connect to backend server. Please verify backend service is running on http://localhost:8080"
        );
      }
      throw error;
    }
  },

  async register(values: RegistrationValues): Promise<AuthUser> {
    const {
      username,
      email,
      password,
      name,
      first_name,
      last_name,
      phone_number,
      role_names,
      station_id,
      employee_code,
    } = values;

    if (!email?.trim() || !password) {
      throw new Error("Complete all required fields to create your account.");
    }

    const derivedUsername: string = username?.trim() || email.trim().split("@")[0] || "user";
    const derivedFirstName: string =
      first_name?.trim() || name?.trim().split(" ")[0] || derivedUsername;
    const derivedLastName: string =
      last_name?.trim() ||
      (name?.trim().includes(" ") ? name.trim().split(" ").slice(1).join(" ") : "");

    const payload = {
      username: derivedUsername,
      email: email.trim().toLowerCase(),
      password,
      first_name: derivedFirstName,
      last_name: derivedLastName,
      phone_number: phone_number?.trim() || "",
      role_names: role_names?.length ? role_names : ["ROLE_CITIZEN"],
      ...(station_id ? { station_id } : {}),
      ...(employee_code ? { employee_code } : {}),
    };

    try {
      await fetchApi<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Automatically log in newly registered user to receive real JWT token
      return await authService.login({ username: payload.username, password: payload.password });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (
        error instanceof Error &&
        (error.message.includes("Failed to fetch") || error.message.includes("network"))
      ) {
        throw new Error(
          "Unable to connect to backend server. Please verify backend service is running on http://localhost:8080"
        );
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetchApi<{ message: string }>("/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors during logout so local session always clears
    } finally {
      window.localStorage.removeItem(SESSION_KEY);
      window.localStorage.removeItem(TOKEN_KEY);
    }
  },
};
