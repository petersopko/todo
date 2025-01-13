import type { H3Event } from "h3";

interface ApiError {
  error: true;
  statusCode: number;
  message: string;
}

interface ApiState {
  loading: boolean;
  activeRequests: number;
}

// Global state to track API requests
const apiState: ApiState = {
  loading: false,
  activeRequests: 0,
};

export const getApiState = () => apiState;

const startRequest = () => {
  apiState.activeRequests++;
  apiState.loading = true;
};

const endRequest = () => {
  apiState.activeRequests--;
  apiState.loading = apiState.activeRequests > 0;
};

export const createApiError = (
  statusCode: number,
  message: string,
): ApiError => ({
  error: true,
  statusCode,
  message,
});

export const handleApiError = (error: unknown): ApiError => {
  if (error && typeof error === "object" && "statusCode" in error) {
    return error as ApiError;
  }
  return createApiError(500, `API Error: ${error}`);
};

export const callApi = async <T>(
  event: H3Event,
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: Record<string, unknown>;
    fields?: string;
    sort?: string;
    filter?: Record<string, unknown>;
  } = {},
): Promise<T> => {
  const config = useRuntimeConfig(event);

  if (!config.apiBaseUrl || !config.apiAccessToken) {
    throw createApiError(
      503,
      "API configuration is missing. Check environment variables.",
    );
  }

  const { method = "GET", body, fields, sort, filter } = options;

  // Build URL with query parameters
  let url = `${config.apiBaseUrl}/${path}?access_token=${config.apiAccessToken}`;
  if (fields) url += `&fields=${fields}`;
  if (sort) url += `&sort=${sort}`;
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      url += `&${key}=${value}`;
    });
  }

  startRequest();

  try {
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw createApiError(
        response.status,
        `API request failed: ${response.statusText}`,
      );
    }

    const data = await response.json();

    if (data.errors) {
      throw createApiError(400, data.errors);
    }

    return data as T;
  } catch (error) {
    throw handleApiError(error);
  } finally {
    endRequest();
  }
};
