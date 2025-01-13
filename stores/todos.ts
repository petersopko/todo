import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { Todo } from "~/types/api";
import { useCategoriesStore } from "~/stores/categories";
import { useUserStore } from "~/stores/user";
import { useToastStore } from "~/stores/toast";

export const useTodosStore = defineStore("todos", () => {
  console.log("[TodosStore] Creating store instance");
  const items = ref<Todo[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const categoriesStore = useCategoriesStore();
  const userStore = useUserStore();
  const toastStore = useToastStore();
  const hasInitialized = ref(false);
  const isInitializing = ref(false);

  const getTodoById = (id: string) => {
    return items.value?.find((todo) => todo.id === id);
  };

  const getTodosByCategory = (categoryId: string) => {
    return (
      items.value?.filter((todo) => todo.category?.id === categoryId) ?? []
    );
  };

  const getCompletedTodosByCategory = (categoryId: string) => {
    return (
      items.value?.filter(
        (todo) => todo.category?.id === categoryId && todo.is_completed,
      ) ?? []
    ).sort((a, b) => {
      const dateA = new Date(a.date_updated || a.date_created);
      const dateB = new Date(b.date_updated || b.date_created);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const getUncompletedTodosByCategory = (categoryId: string) => {
    return (
      items.value?.filter(
        (todo) => todo.category?.id === categoryId && !todo.is_completed,
      ) ?? []
    );
  };

  const completedTodos = computed(() =>
    (items.value?.filter((todo) => todo.is_completed) ?? []).sort((a, b) => {
      const dateA = new Date(a.date_updated || a.date_created);
      const dateB = new Date(b.date_updated || b.date_created);
      return dateB.getTime() - dateA.getTime();
    }),
  );

  const recentCompletedTodos = computed(() => completedTodos.value.slice(0, 3));

  const uncompletedTodos = computed(
    () => items.value?.filter((todo) => !todo.is_completed) ?? [],
  );

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
      console.log(
        "[TodosStore] Skipping fetch - already initialized or initializing",
        {
          hasInitialized: hasInitialized.value,
          isInitializing: isInitializing.value,
          itemCount: items.value?.length,
        },
      );
      return;
    }

    console.log("[TodosStore] Starting fetch");
    isLoading.value = true;
    isInitializing.value = true;
    error.value = null;

    try {
      const response = await $fetch<
        { data: Todo[] } | { error: true; statusCode: number; message: string }
      >("/api/todos", {
        params: { fields: "*.*" },
      });

      if ("error" in response) {
        console.error("[TodosStore] API error response:", response);
        throw new Error(response.message);
      }

      if (!response?.data || !Array.isArray(response.data)) {
        console.error("[TodosStore] Invalid API response:", response);
        throw new Error("Invalid response format from API");
      }

      items.value = response.data.map((todo) => ({
        ...todo,
        category: todo.category || { id: "", name: "", color: "", todos: [] },
        is_completed: !!todo.is_completed,
        date_created: todo.date_created || new Date().toISOString(),
        date_updated:
          todo.date_updated || todo.date_created || new Date().toISOString(),
      }));

      hasInitialized.value = true;
      console.log("[TodosStore] Fetch successful:", {
        itemCount: items.value.length,
        hasInitialized: hasInitialized.value,
      });

      if (items.value.length > 0 && items.value[0].user_created) {
        userStore.setUser(items.value[0].user_created);
      }
    } catch (e) {
      console.error("[TodosStore] Fetch failed:", e);
      items.value = [];
      hasInitialized.value = false;
      throw handleError(e, "Failed to fetch todos", true);
    } finally {
      console.log("[TodosStore] Fetch complete", {
        hasInitialized: hasInitialized.value,
        isInitializing: isInitializing.value,
        itemCount: items.value?.length,
        error: error.value,
      });
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
      throw handleError(e, "Failed to create todo", true);
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
      throw handleError(e, "Failed to update todo status", true);
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
      throw handleError(e, "Failed to delete todo", true);
    }
  };

  const reorderTodos = (newOrder: Todo[]) => {
    if (newOrder.length !== items.value.length) {
      console.warn("Attempted to reorder with different number of items:", {
        current: items.value.length,
        new: newOrder.length,
      });
      return;
    }

    const currentIds = new Set(items.value.map((t) => t.id));
    const newIds = new Set(newOrder.map((t) => t.id));
    if (currentIds.size !== newIds.size) {
      console.warn("Attempted to reorder with different items");
      return;
    }

    console.log("Reordering todos:", {
      before: items.value.length,
      after: newOrder.length,
    });
    items.value = newOrder;
  };

  watch(items, (newItems, oldItems) => {
    console.log("items changed:", {
      oldLength: oldItems?.length,
      newLength: newItems.length,
      stack: new Error().stack,
    });
  });

  watch(completedTodos, (newCompletedTodos) => {
    console.log("completedTodos changed:", newCompletedTodos.length);
  });

  watch(recentCompletedTodos, (newRecentCompletedTodos) => {
    console.log(
      "recentCompletedTodos changed:",
      newRecentCompletedTodos.length,
    );
  });

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
