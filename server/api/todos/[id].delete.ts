export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
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
        method: "DELETE",
      },
    );

    if (!response.ok) {
      return {
        error: true,
        statusCode: response.status,
        message: `Failed to delete todo: ${response.statusText}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      error: true,
      statusCode: 500,
      message: error instanceof Error ? error.message : "Failed to delete todo",
    };
  }
});
