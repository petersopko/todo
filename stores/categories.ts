import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { Category } from "~/types/api";
import type { ApiResponse } from "~/utils/errorHandling";
import { handleApiError } from "~/utils/errorHandling";
import { useToastStore } from "~/stores/toast";

type InitializationState =
  | "uninitialized"
  | "initializing"
  | "initialized"
  | "error";

export const useCategoriesStore = defineStore("categories", () => {
  // ==================== State ====================
  const items = ref<Category[]>([]);
  const selectedCategoryId = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const initState = ref<InitializationState>("uninitialized");

  // Store dependencies
  const toastStore = useToastStore();
  const { t } = useI18n();

  // ==================== Queries ====================
  const getCategoryById = (id: string) =>
    items.value.find((category) => category.id === id);

  const getCategoryByName = (name: string) =>
    items.value.find((category) => category.name === name);

  // ==================== Computed State ====================
  const selectedCategory = computed(() =>
    selectedCategoryId.value ? getCategoryById(selectedCategoryId.value) : null,
  );

  const translatedCategories = computed(() =>
    items.value.map((category) => ({
      ...category,
      name: t(`categories.${category.name.toLowerCase()}`, category.name),
    })),
  );

  // ==================== Error Handling ====================
  const handleError = (e: unknown, defaultMessage: string) => {
    const result = handleApiError(e, defaultMessage);
    error.value = result.message;
    initState.value = "error";
    toastStore.showError(result.message);
    return new Error(result.message);
  };

  // ==================== Actions ====================
  const selectCategory = (id: string | null) => {
    selectedCategoryId.value = id;
  };

  const canFetch = computed(
    () => initState.value === "uninitialized" || initState.value === "error",
  );

  // ==================== CRUD Operations ====================
  const fetchCategories = async () => {
    if (!canFetch.value) return;

    isLoading.value = true;
    initState.value = "initializing";
    error.value = null;

    try {
      const response = await $fetch<ApiResponse<Category[]>>(
        "/api/categories",
        {
          params: { fields: "*.*" },
        },
      );

      if ("error" in response) throw response;

      items.value = response.data;
      initState.value = "initialized";

      // Auto-select first category if none selected
      if (!selectedCategoryId.value && items.value.length > 0) {
        selectedCategoryId.value = items.value[0].id;
      }
    } catch (e) {
      items.value = [];
      throw handleError(e, t("errors.failedToFetchCategories"));
    } finally {
      isLoading.value = false;
    }
  };

  // ==================== Utilities ====================
  const resetState = () => {
    items.value = [];
    selectedCategoryId.value = null;
    error.value = null;
    initState.value = "uninitialized";
    isLoading.value = false;
  };

  // Development mode watchers
  if (import.meta.dev) {
    watch(items, (newItems) => {
      console.log("[CategoriesStore] Items updated:", newItems);
    });

    watch(initState, (newState) => {
      console.log("[CategoriesStore] State changed:", newState);
    });

    watch(selectedCategoryId, (newId) => {
      console.log("[CategoriesStore] Selected category changed:", newId);
    });
  }

  return {
    // State
    items,
    selectedCategoryId,
    isLoading,
    error,
    initState,

    // Queries
    getCategoryById,
    getCategoryByName,
    selectedCategory,
    translatedCategories,

    // Actions
    selectCategory,
    fetchCategories,

    // Utilities
    resetState,
  };
});
