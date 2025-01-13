import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import type { Category } from "~/types/api";
import { useToastStore } from "~/stores/toast";

export const useCategoriesStore = defineStore("categories", () => {
  const { t } = useI18n();
  const toastStore = useToastStore();
  const items = ref<Category[]>([]);
  const selectedCategoryId = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const hasInitialized = ref(false);
  const isInitializing = ref(false);

  const getCategoryById = (id: string) => {
    return items.value.find((category) => category.id === id);
  };

  const getCategoryByName = (name: string) => {
    return items.value.find((category) => category.name === name);
  };

  const selectedCategory = computed(() =>
    selectedCategoryId.value ? getCategoryById(selectedCategoryId.value) : null,
  );

  const translatedCategories = computed(() =>
    items.value.map((category) => ({
      ...category,
      name: t(`categories.${category.name.toLowerCase()}`, category.name),
    })),
  );

  const selectCategory = (id: string | null) => {
    selectedCategoryId.value = id;
  };

  const fetchCategories = async () => {
    if (hasInitialized.value || isInitializing.value) return;

    isLoading.value = true;
    isInitializing.value = true;
    error.value = null;
    console.log("[CategoriesStore] Starting fetch");

    try {
      console.log("[CategoriesStore] Fetching categories from API");
      const response = await $fetch<
        | { data: Category[] }
        | { error: true; statusCode: number; message: string }
      >("/api/categories", {
        params: { fields: "*.*" },
      });

      if ("error" in response) {
        console.error("[CategoriesStore] API error response:", response);
        error.value = response.message;
        items.value = [];
        toastStore.showError(response.message);

        return;
      }

      if (!response?.data || !Array.isArray(response.data)) {
        console.error("[CategoriesStore] Invalid API response:", response);
        const message = "Invalid response format from API";
        error.value = message;
        items.value = [];
        toastStore.showError(message);

        return;
      }

      console.log(
        "[CategoriesStore] Successfully fetched categories:",
        response.data,
      );
      items.value = response.data;

      if (!selectedCategoryId.value && items.value.length > 0) {
        selectedCategoryId.value = items.value[0].id;
      }
    } catch (e) {
      console.error("[CategoriesStore] Network error:", e);
      const message = "Failed to connect to the server";
      error.value = message;
      items.value = [];
      toastStore.showError(message);
    } finally {
      hasInitialized.value = true;
      isLoading.value = false;
      isInitializing.value = false;
    }
  };

  return {
    items,
    selectedCategoryId,
    isLoading,
    error,
    hasInitialized,
    getCategoryById,
    getCategoryByName,
    selectedCategory,
    translatedCategories,
    selectCategory,
    fetchCategories,
  };
});
