import { envConfig } from "../config/env";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = envConfig.apiBaseUrl.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options?.headers as Record<string, string>) || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      try {
        const errorData = (await response.json()) as { message?: string };
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Fallback to HTTP error message if response is not JSON
      }
      throw new ApiError(response.status, errorMessage);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(
      error instanceof Error ? error.message : "An unexpected network error occurred"
    );
  }
}
