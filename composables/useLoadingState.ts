import { useTodosStore } from "~/stores/todos";
import { useCategoriesStore } from "~/stores/categories";

type ApiEndpoint =
  | "todos/get"
  | "todos/create"
  | "todos/update"
  | "todos/delete"
  | "categories/get";

interface ApiCall {
  endpoint: ApiEndpoint;
  startTime: number;
  duration?: number;
}

export const useLoadingState = () => {
  const todosStore = useTodosStore();
  const categoriesStore = useCategoriesStore();
  const activeApiCalls = ref<ApiCall[]>([]);

  // Store loading states
  const storeLoadingStates = computed(() => ({
    todos: todosStore.isLoading,
    categories: categoriesStore.isLoading,
  }));

  const isAnyStoreLoading = computed(
    () => todosStore.isLoading || categoriesStore.isLoading,
  );

  // API call states
  const isAnyApiLoading = computed(() => activeApiCalls.value.length > 0);

  const apiLoadingStates = computed(() => {
    const states: Record<ApiEndpoint, boolean> = {
      "todos/get": false,
      "todos/create": false,
      "todos/update": false,
      "todos/delete": false,
      "categories/get": false,
    };

    activeApiCalls.value.forEach((call) => {
      states[call.endpoint] = true;
    });

    return states;
  });

  // Track API call start
  const trackApiCallStart = (endpoint: ApiEndpoint) => {
    const call: ApiCall = {
      endpoint,
      startTime: Date.now(),
    };
    activeApiCalls.value.push(call);
    console.log(`🌐 API Call Started: ${endpoint}`);
  };

  // Track API call end
  const trackApiCallEnd = (endpoint: ApiEndpoint) => {
    const index = activeApiCalls.value.findIndex(
      (call) => call.endpoint === endpoint,
    );
    if (index !== -1) {
      const call = activeApiCalls.value[index];
      call.duration = Date.now() - call.startTime;
      console.log(`✅ API Call Completed: ${endpoint} (${call.duration}ms)`);
      activeApiCalls.value.splice(index, 1);
    }
  };

  // Track API call error
  const trackApiCallError = (endpoint: ApiEndpoint, error: Error) => {
    const index = activeApiCalls.value.findIndex(
      (call) => call.endpoint === endpoint,
    );
    if (index !== -1) {
      const call = activeApiCalls.value[index];
      call.duration = Date.now() - call.startTime;
      console.error(
        `❌ API Call Failed: ${endpoint} (${call.duration}ms)`,
        error,
      );
      activeApiCalls.value.splice(index, 1);
    }
  };

  // Watch for store loading states and log them
  watch(
    () => todosStore.isLoading,
    (isLoading) => {
      console.log(`📦 Todos Store: ${isLoading ? "Loading..." : "Complete"}`);
    },
  );

  watch(
    () => categoriesStore.isLoading,
    (isLoading) => {
      console.log(
        `📦 Categories Store: ${isLoading ? "Loading..." : "Complete"}`,
      );
    },
  );

  return {
    // Store loading states
    storeLoadingStates,
    isAnyStoreLoading,

    // API loading states
    apiLoadingStates,
    isAnyApiLoading,
    activeApiCalls: readonly(activeApiCalls),

    // API tracking methods
    trackApiCallStart,
    trackApiCallEnd,
    trackApiCallError,
  };
};
