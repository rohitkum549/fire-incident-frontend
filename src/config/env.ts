interface EnvironmentConfig {
  apiBaseUrl: string;
  appEnv: "development" | "UAT" | "production";
  appName: string;
}

const getEnvVariable = (key: keyof ImportMetaEnv, defaultValue: string): string => {
  const value = import.meta.env[key];
  if (!value && typeof process !== "undefined" && process.env?.NODE_ENV === "test") {
    return defaultValue;
  }
  return value || defaultValue;
};

export const envConfig: EnvironmentConfig = {
  apiBaseUrl: getEnvVariable("VITE_API_BASE_URL", "http://localhost:8080/api"),
  appEnv: getEnvVariable("VITE_APP_ENV", "development") as EnvironmentConfig["appEnv"],
  appName: getEnvVariable("VITE_APP_NAME", "Fire Incident Management System"),
};
