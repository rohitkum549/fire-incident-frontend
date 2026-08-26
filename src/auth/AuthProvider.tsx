import React, { useMemo, useState } from "react";
import { authService } from "./authService";
import { AuthContext } from "./AuthContext";
import type { AuthContextValue } from "./AuthContext";
import type { AuthUser, LoginCredentials, RegistrationValues } from "./types";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getSession());

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      async login(credentials: LoginCredentials): Promise<void> {
        setUser(await authService.login(credentials));
      },
      async register(values: RegistrationValues): Promise<void> {
        setUser(await authService.register(values));
      },
      logout(): void {
        authService.logout();
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
