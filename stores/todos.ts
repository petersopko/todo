import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { Todo } from "~/types/api";
import type { ApiResponse } from "~/utils/errorHandling";
import { handleApiError } from "~/utils/errorHandling";
import { useCategoriesStore } from "~/stores/categories";
import { useUserStore } from "~/stores/user";
import { useToastStore } from "~/stores/toast";

type InitializationState =
  | "uninitialized"
  | "initializing"
  | "initialized"
  | "error";

export const useTodosStore = defineStore("todos", () => {
  // ==================== State ====================
  const items = ref<Todo[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const initState = ref<InitializationState>("uninitialized");

  // Store dependencies
  const categoriesStore = useCategoriesStore();
  const userStore = useUserStore();
  const toastStore = useToastStore();
  const { t } = useI18n();

  // ==================== Data Normalization ====================
  const normalizeTodo = (todo: Todo): Todo => {
    const category = todo.category || {
      id: "",
      name: "",
      color: "",
      todos: [],
    };

    return {
      ...todo,
      category,
      is_completed: !!todo.is_completed,
      date_created: todo.date_created || new Date().toISOString(),
      date_updated:
        todo.date_updated || todo.date_created || new Date().toISOString(),
    };
  };

  const getTranslatedCategoryName = (
    categoryId: string,
    fallbackName: string,
  ) => {
    const translatedCategory = categoriesStore.translatedCategories.find(
      (c) => c.id === categoryId,
    );
    return translatedCategory?.name || fallbackName;
  };

  const translatedTodos = computed(() =>
    items.value.map((todo) => ({
      ...todo,
      category: {
        ...todo.category,
        name: todo.category?.id
          ? getTranslatedCategoryName(todo.category.id, todo.category.name)
          : todo.category?.name || "",
      },
    })),
  );

  // ==================== Filtering & Queries ====================
  const filterTodos = (
    todos: Todo[],
    {
      categoryId,
      completed,
    }: { categoryId?: string; completed?: boolean } = {},
  ) => {
    return todos.filter((todo) => {
      if (categoryId !== undefined && todo.category?.id !== categoryId)
        return false;
      if (completed !== undefined && todo.is_completed !== completed)
        return false;
      return true;
    });
  };

  // Query methods
  const getTodoById = (id: string) =>
    translatedTodos.value.find((todo) => todo.id === id);

  const getTodosByCategory = (categoryId: string) =>
    filterTodos(translatedTodos.value, { categoryId });

  const getCompletedTodosByCategory = (categoryId: string) =>
    filterTodos(translatedTodos.value, { categoryId, completed: true });

  const getUncompletedTodosByCategory = (categoryId: string) =>
    filterTodos(translatedTodos.value, { categoryId, completed: false });

  // Computed queries
  const completedTodos = computed(() =>
    filterTodos(translatedTodos.value, { completed: true }),
  );

  const uncompletedTodos = computed(() =>
    filterTodos(translatedTodos.value, { completed: false }),
  );

  const recentCompletedTodos = computed(() => completedTodos.value.slice(0, 3));

  // ==================== Error Handling ====================
  const handleError = (e: unknown, defaultMessage: string) => {
    const result = handleApiError(e, defaultMessage);
    error.value = result.message;
    initState.value = "error";
    return new Error(result.message);
  };

  // ==================== CRUD Operations ====================
  const canFetch = computed(
    () => initState.value === "uninitialized" || initState.value === "error",
  );

  // Read
  const fetchTodos = async () => {
    if (!canFetch.value) return;

    isLoading.value = true;
    initState.value = "initializing";
    error.value = null;

    try {
      const response = await $fetch<ApiResponse<Todo[]>>("/api/todos", {
        params: {
          fields: "*.*",
          sort: "-date_updated",
        },
      });

      if ("error" in response) throw response;

      items.value = response.data.map(normalizeTodo);
      initState.value = "initialized";

      if (items.value.length > 0 && items.value[0].user_created) {
        userStore.setUser(items.value[0].user_created);
      }
    } catch (e) {
      items.value = [];
      throw handleError(e, t("errors.failedToFetchTodos"));
    } finally {
      isLoading.value = false;
    }
  };

  // Create
  const createTodo = async (text: string, categoryId: string) => {
    try {
      const response = await $fetch<ApiResponse<Todo>>("/api/todos", {
        method: "POST",
        body: { todo: text, category: categoryId },
      });

      if ("error" in response) throw response;

      const category = categoriesStore.getCategoryById(categoryId);
      if (!category) throw new Error(t("errors.categoryNotFound"));

      items.value.push({
        ...response.data,
        category: {
          id: categoryId,
          name: category.name,
          color: category.color,
          todos: [],
        },
      });
    } catch (e) {
      throw handleError(e, t("errors.failedToCreateTodo"));
    }
  };

  // Update
  const updateTodoStatus = async (id: string, completed: boolean) => {
    let todo: Todo | undefined;
    try {
      todo = items.value.find((t) => t.id === id);
      if (!todo) return;

      // Optimistic update
      todo.is_completed = completed;

      const response = await $fetch<ApiResponse<Todo>>(`/api/todos/${id}`, {
        method: "PATCH",
        body: { is_completed: completed },
      });

      if ("error" in response) throw response;
    } catch (e) {
      // Rollback on error
      if (todo) todo.is_completed = !completed;
      throw handleError(e, t("errors.failedToUpdateTodo"));
    }
  };

  // Delete
  const deleteTodo = async (id: string) => {
    let deletedTodo: Todo | undefined;
    let index = -1;

    try {
      index = items.value.findIndex((t) => t.id === id);
      if (index === -1) return;

      // Optimistic delete
      deletedTodo = items.value.splice(index, 1)[0];

      const response = await $fetch<ApiResponse<null>>(`/api/todos/${id}`, {
        method: "DELETE",
      });

      // DELETE returns null on success, only check for error if response exists
      if (response && "error" in response) throw response;

      toastStore.showSuccess(t("messages.taskDeleted"));
    } catch (e) {
      // Rollback on error
      if (deletedTodo) items.value.splice(index, 0, deletedTodo);
      throw handleError(e, t("errors.failedToDeleteTodo"));
    }
  };

  // ==================== Utilities ====================
  const reorderTodos = (newOrder: Todo[]) => {
    if (newOrder.length !== items.value.length) return;

    const currentIds = new Set(items.value.map((t) => t.id));
    const newIds = new Set(newOrder.map((t) => t.id));
    if (currentIds.size !== newIds.size) return;

    items.value = newOrder;
  };

  const resetState = () => {
    items.value = [];
    error.value = null;
    initState.value = "uninitialized";
    isLoading.value = false;
  };

  // Development mode watchers
  if (import.meta.dev) {
    watch(items, (newItems) => {
      console.log("[TodosStore] Items updated:", newItems);
    });

    watch(initState, (newState) => {
      console.log("[TodosStore] State changed:", newState);
    });
  }

  return {
    // State
    items,
    isLoading,
    error,
    initState,
    canFetch,

    // Queries
    getTodoById,
    getTodosByCategory,
    getCompletedTodosByCategory,
    getUncompletedTodosByCategory,
    completedTodos,
    recentCompletedTodos,
    uncompletedTodos,

    // CRUD
    fetchTodos,
    createTodo,
    updateTodoStatus,
    deleteTodo,

    // Utilities
    reorderTodos,
    resetState,
  };
});
