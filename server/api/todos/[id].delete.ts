import { callApi } from "../../utils/api";

interface ApiResponse {
  data: null;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    return {
      error: true,
      statusCode: 400,
      message: "Missing todo ID",
    };
  }

  try {
    return await callApi<ApiResponse>(event, `todos/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    return error;
  }
});
