import type { AuthUser, LoginCredentials, RegistrationValues } from "./types";

const SESSION_KEY = "fire-system-session";

const readSession = (): AuthUser | null => {
  try {
    const storedSession = window.localStorage.getItem(SESSION_KEY);
    if (!storedSession) {
      return null;
    }

    const session = JSON.parse(storedSession) as AuthUser;
    return session.id && session.name && session.email ? session : null;
  } catch {
    return null;
  }
};

const saveSession = (user: AuthUser): void => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const authService = {
  getSession(): AuthUser | null {
    return readSession();
  },

  async login({ username, password }: LoginCredentials): Promise<AuthUser> {
    if (!username.trim() || !password.trim()) {
      throw new Error("Enter both your username or email and password.");
    }

    const name = username.trim().split("@")[0] || "Operator";
    const user: AuthUser = {
      id: `local-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      name,
      email: username.includes("@") ? username.trim() : `${name}@fire-system.local`,
    };
    saveSession(user);
    return user;
  },

  async register({ name, email, password }: RegistrationValues): Promise<AuthUser> {
    if (!name.trim() || !email.trim() || !password) {
      throw new Error("Complete all required fields to create your account.");
    }

    const user: AuthUser = {
      id: `local-${email
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };
    saveSession(user);
    return user;
  },

  logout(): void {
    window.localStorage.removeItem(SESSION_KEY);
  },
};
