import { callApi } from "../utils/api";

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
  const query = getQuery(event);

  try {
    return await callApi<ApiResponse>(event, "categories", {
      fields: query.fields as string,
    });
  } catch (error) {
    return error;
  }
});
