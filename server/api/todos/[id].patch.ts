export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    return {
      error: true,
      statusCode: 400,
      message: "Missing todo ID",
    };
  }

  try {
    const response = await fetch(
      `${config.apiBaseUrl}/todos/${id}?access_token=${config.apiAccessToken}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      return {
        error: true,
        statusCode: response.status,
        message: `Failed to update todo: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: true,
      statusCode: 500,
      message: error instanceof Error ? error.message : "Failed to update todo",
    };
  }
});
