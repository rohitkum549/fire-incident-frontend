import { createContext } from "react";
import type { AuthUser, LoginCredentials, RegistrationValues } from "./types";

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (values: RegistrationValues) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
