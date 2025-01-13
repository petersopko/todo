export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody(event);

  try {
    const response = await fetch(
      `${config.apiBaseUrl}/todos?access_token=${config.accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();
    if (data.errors) {
      throw {
        error: true,
        statusCode: 400,
        message: data.errors,
      };
    }

    return data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    throw {
      error: true,
      statusCode: 500,
      message: "Failed to create task: " + error,
    };
  }
});
