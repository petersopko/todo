import { callApi } from "../../utils/api";
import type { Todo } from "~/types/api";

interface ApiResponse {
  data: Todo;
}

export default defineEventHandler(async (event) => {
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
    return await callApi<ApiResponse>(event, `todos/${id}`, {
      method: "PATCH",
      body,
    });
  } catch (error) {
    return error;
  }
});
