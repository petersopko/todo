import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { Todo } from "~/types/api";
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

  // Computed getters using the filter function
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

  const handleError = (
    e: unknown,
    defaultMessage: string,
    showToast = true,
  ) => {
    const message = e instanceof Error ? e.message : defaultMessage;
    error.value = message;
    if (showToast && import.meta.client) {
      toastStore.showError(message);
    }
    return new Error(message);
  };

  const fetchTodos = async () => {
    if (hasInitialized.value || isInitializing.value) {
      return;
    }

    isLoading.value = true;
    isInitializing.value = true;
    error.value = null;

    try {
      const response = await $fetch<
        { data: Todo[] } | { error: true; statusCode: number; message: string }
      >("/api/todos", {
        params: {
          fields: "*.*",
          sort: "-date_updated",
        },
      });

      if ("error" in response) {
        throw new Error(response.message);
      }

      if (!response?.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format from API");
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
      throw handleError(e, t("errors.failedToFetchTodos"), true);
    } finally {
      isLoading.value = false;
      isInitializing.value = false;
    }
  };

  const createTodo = async (text: string, categoryId: string) => {
    try {
      const response = await $fetch<{ data: Todo }>("/api/todos", {
        method: "POST",
        body: {
          todo: text,
          category: categoryId,
        },
      });

      const category = categoriesStore.getCategoryById(categoryId);
      if (!category) {
        throw new Error("Category not found");
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
      throw handleError(e, t("errors.failedToCreateTodo"), true);
    }
  };

  const updateTodoStatus = async (id: string, completed: boolean) => {
    let todo: Todo | undefined;
    try {
      todo = items.value.find((t) => t.id === id);
      if (!todo) return;

      todo.is_completed = completed;

      await $fetch(`/api/todos/${id}`, {
        method: "PATCH",
        body: { is_completed: completed },
      });
    } catch (e) {
      if (todo) {
        todo.is_completed = !completed;
      }
      throw handleError(e, t("errors.failedToUpdateTodo"), true);
    }
  };

  const deleteTodo = async (id: string) => {
    let deletedTodo: Todo | undefined;
    let index = -1;

    try {
      index = items.value.findIndex((t) => t.id === id);
      if (index === -1) return;

      deletedTodo = items.value.splice(index, 1)[0];

      await $fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      toastStore.showSuccess("Task deleted successfully");
    } catch (e) {
      if (deletedTodo) {
        items.value.splice(index, 0, deletedTodo);
      }
      throw handleError(e, t("errors.failedToDeleteTodo"), true);
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
