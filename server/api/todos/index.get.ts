export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const query = getQuery(event);
  const { fields, sort, ...rest } = query;

  try {
    let url = `${config.apiBaseUrl}/todos?access_token=${config.apiAccessToken}`;
    if (fields) url += `&fields=${fields}`;
    if (sort) url += `&sort=${sort}`;

    Object.entries(rest).forEach(([key, value]) => {
      url += `&${key}=${value}`;
    });

    const response = await fetch(url);
    if (!response.ok) {
      return {
        error: true,
        statusCode: response.status,
        message: `Failed to fetch todos: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: true,
      statusCode: 500,
      message: error instanceof Error ? error.message : "Failed to fetch todos",
    };
  }
});
