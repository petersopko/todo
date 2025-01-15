export const useNewTaskStore = defineStore("newTask", () => {
  const text = ref("");
  const selectedCategoryId = ref("");
  const categoriesStore = useCategoriesStore();

  const isValid = computed(() => {
    const categoryExists = categoriesStore.items.some(
      (category) => category.id === selectedCategoryId.value,
    );
    return text.value.trim().length > 0 && categoryExists;
  });

  const selectCategory = (categoryId: string) => {
    selectedCategoryId.value = categoryId;
  };

  const setText = (newText: string) => {
    text.value = newText;
  };

  const reset = () => {
    text.value = "";
  };

  const resetAll = () => {
    text.value = "";
    selectedCategoryId.value = "";
  };

  return {
    text,
    selectedCategoryId,
    isValid,
    selectCategory,
    setText,
    reset,
    resetAll,
  };
});
