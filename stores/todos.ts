import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { Todo } from "~/types/api";
import type { ApiResponse } from "~/utils/errorHandling";
import { handleApiError } from "~/utils/errorHandling";
import { useCategoriesStore } from "~/stores/categories";
import { useUserStore } from "~/stores/user";
import { useToastStore } from "~/stores/toast";

export const useTodosStore = defineStore("todos", () => {
  const items = ref<Todo[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const categoriesStore = useCategoriesStore();
  const userStore = useUserStore();
  const toastStore = useToastStore();
  const hasInitialized = ref(false);
  const isInitializing = ref(false);
  const { t } = useI18n();

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

  const getTodoById = (id: string) =>
    translatedTodos.value.find((todo) => todo.id === id);

  const getTodosByCategory = (categoryId: string) =>
    filterTodos(translatedTodos.value, { categoryId });

  const getCompletedTodosByCategory = (categoryId: string) =>
    filterTodos(translatedTodos.value, { categoryId, completed: true });

  const getUncompletedTodosByCategory = (categoryId: string) =>
    filterTodos(translatedTodos.value, { categoryId, completed: false });

  const completedTodos = computed(() =>
    filterTodos(translatedTodos.value, { completed: true }),
  );

  const uncompletedTodos = computed(() =>
    filterTodos(translatedTodos.value, { completed: false }),
  );

  const recentCompletedTodos = computed(() => completedTodos.value.slice(0, 3));

  const resetState = () => {
    items.value = [];
    error.value = null;
    hasInitialized.value = false;
  };

  const handleError = (e: unknown, defaultMessage: string) => {
    const result = handleApiError(e, defaultMessage);
    error.value = result.message;
    return new Error(result.message);
  };

  const fetchTodos = async () => {
    if (hasInitialized.value || isInitializing.value) {
      return;
    }

    isLoading.value = true;
    isInitializing.value = true;
    error.value = null;

    try {
      const response = await $fetch<ApiResponse<Todo[]>>("/api/todos", {
        params: {
          fields: "*.*",
          sort: "-date_updated",
        },
      });

      if ("error" in response) {
        throw response;
      }

      items.value = response.data.map((todo) => {
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
      });

      hasInitialized.value = true;

      if (items.value.length > 0 && items.value[0].user_created) {
        userStore.setUser(items.value[0].user_created);
      }
    } catch (e) {
      items.value = [];
      hasInitialized.value = false;
      throw handleError(e, t("errors.failedToFetchTodos"));
    } finally {
      isLoading.value = false;
      isInitializing.value = false;
    }
  };

  const createTodo = async (text: string, categoryId: string) => {
    try {
      const response = await $fetch<ApiResponse<Todo>>("/api/todos", {
        method: "POST",
        body: {
          todo: text,
          category: categoryId,
        },
      });

      if ("error" in response) {
        throw response;
      }

      const category = categoriesStore.getCategoryById(categoryId);
      if (!category) {
        throw new Error(t("errors.categoryNotFound"));
      }

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

  const updateTodoStatus = async (id: string, completed: boolean) => {
    let todo: Todo | undefined;
    try {
      todo = items.value.find((t) => t.id === id);
      if (!todo) return;

      todo.is_completed = completed;

      const response = await $fetch<ApiResponse<Todo>>(`/api/todos/${id}`, {
        method: "PATCH",
        body: { is_completed: completed },
      });

      if ("error" in response) {
        throw response;
      }
    } catch (e) {
      if (todo) {
        todo.is_completed = !completed;
      }
      throw handleError(e, t("errors.failedToUpdateTodo"));
    }
  };

  const deleteTodo = async (id: string) => {
    let deletedTodo: Todo | undefined;
    let index = -1;

    try {
      index = items.value.findIndex((t) => t.id === id);
      if (index === -1) return;

      deletedTodo = items.value.splice(index, 1)[0];

      const response = await $fetch<ApiResponse<void>>(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if ("error" in response) {
        throw response;
      }

      toastStore.showSuccess(t("messages.taskDeleted"));
    } catch (e) {
      if (deletedTodo) {
        items.value.splice(index, 0, deletedTodo);
      }
      throw handleError(e, t("errors.failedToDeleteTodo"));
    }
  };

  const reorderTodos = (newOrder: Todo[]) => {
    if (newOrder.length !== items.value.length) {
      return;
    }

    const currentIds = new Set(items.value.map((t) => t.id));
    const newIds = new Set(newOrder.map((t) => t.id));
    if (currentIds.size !== newIds.size) {
      return;
    }

    items.value = newOrder;
  };

  watch(items, () => {});

  watch(completedTodos, () => {});

  watch(recentCompletedTodos, () => {});

  return {
    items,
    isLoading,
    error,
    hasInitialized,
    getTodoById,
    getTodosByCategory,
    getCompletedTodosByCategory,
    getUncompletedTodosByCategory,
    completedTodos,
    recentCompletedTodos,
    uncompletedTodos,
    fetchTodos,
    createTodo,
    updateTodoStatus,
    deleteTodo,
    reorderTodos,
    resetState,
  };
});
