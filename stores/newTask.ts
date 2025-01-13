import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useNewTaskStore = defineStore("newTask", () => {
  const text = ref("");
  const selectedCategoryId = ref("");

  const isValid = computed(
    () => text.value.trim().length > 0 && selectedCategoryId.value,
  );

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
