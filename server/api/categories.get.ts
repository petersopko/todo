interface Category {
  id: string;
  name: string;
  color: string;
  todos: string[];
}

interface ApiResponse {
  data: Category[];
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  console.log("Runtime config:", {
    apiBaseUrl: config.apiBaseUrl,
    apiAccessToken: config.apiAccessToken ? "***" : "missing",
  });

  if (!config.apiBaseUrl || !config.apiAccessToken) {
    return {
      error: true,
      statusCode: 503,
      message: "API configuration is missing. Check environment variables.",
    };
  }

  const query = getQuery(event);
  const fields = query.fields;

  try {
    const url = `${config.apiBaseUrl}/categories?access_token=${config.apiAccessToken}${fields ? `&fields=${fields}` : ""}`;
    console.log("Fetching categories from:", url);

    const response = await fetch(url);
    if (!response.ok) {
      return {
        error: true,
        statusCode: response.status,
        message: `Failed to fetch categories: ${response.statusText}`,
      };
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (!data.data || !Array.isArray(data.data)) {
      return {
        error: true,
        statusCode: 500,
        message: "Invalid API response format",
      };
    }

    return data as ApiResponse;
  } catch (error) {
    console.error("Categories API Error:", error);
    return {
      error: true,
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
});
