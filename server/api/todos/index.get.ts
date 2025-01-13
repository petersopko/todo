import { callApi } from "../../utils/api";
import type { Todo } from "~/types/api";

interface ApiResponse {
  data: Todo[];
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { fields, sort, ...filter } = query;

  try {
    return await callApi<ApiResponse>(event, "todos", {
      fields: fields as string,
      sort: sort as string,
      filter: filter as Record<string, unknown>,
    });
  } catch (error) {
    return error;
  }
});
