import { callApi } from "../../utils/api";
import type { Todo } from "~/types/api";

interface ApiResponse {
  data: Todo;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    return await callApi<ApiResponse>(event, "todos", {
      method: "POST",
      body,
    });
  } catch (error) {
    return error;
  }
});
