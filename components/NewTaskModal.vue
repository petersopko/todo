<template>
  <Modal :open="modelValue" @update:open="onClose">
    <div class="flex h-full flex-col p-6">
      <div class="mb-8 flex items-center justify-between">
        <h2 class="heading-2 font-bold">{{ $t("newTask.title") }}</h2>
        <Button icon="X" variant="icon" class="border-none" @click="onClose" />
      </div>

      <div class="flex flex-col gap-4">
        <TextField
          v-model="newTaskStore.text"
          :placeholder="$t('newTask.placeholder')"
        />

        <Dropdown
          v-model="newTaskStore.selectedCategoryId"
          :options="categoryOptions"
          :placeholder="$t('newTask.selectCategory')"
        />
      </div>

      <div class="mt-4 flex justify-end">
        <Button
          :disabled="!newTaskStore.isValid"
          icon="Plus"
          variant="primary"
          @click="createTask"
        >
          {{ $t("newTask.createButton") }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { useCategoriesStore } from "~/stores/categories";
import { useNewTaskStore } from "~/stores/newTask";
import { useTodosStore } from "~/stores/todos";
import { useToastStore } from "~/stores/toast";

interface Props {
  modelValue: boolean;
  initialCategoryId?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const categoriesStore = useCategoriesStore();
const newTaskStore = useNewTaskStore();
const todosStore = useTodosStore();
const toastStore = useToastStore();

if (props.initialCategoryId) {
  newTaskStore.selectedCategoryId = props.initialCategoryId;
} else {
  watch(
    () => categoriesStore.items,
    (categories) => {
      if (categories.length > 0 && !newTaskStore.selectedCategoryId) {
        newTaskStore.selectedCategoryId = categories[0].id;
      }
    },
    { immediate: true },
  );
}

const categoryOptions = computed(() =>
  categoriesStore.translatedCategories.map((category) => ({
    value: category.id,
    label: category.name,
  })),
);

const createTask = async () => {
  if (!newTaskStore.isValid) return;

  try {
    await todosStore.createTodo(
      newTaskStore.text.trim(),
      newTaskStore.selectedCategoryId,
    );
    toastStore.showSuccess("Task created successfully!");
    newTaskStore.reset();
    emit("update:modelValue", false);
  } catch {
    console.log("error");
  }
};

const onClose = () => {
  newTaskStore.resetAll();
  emit("update:modelValue", false);
};
</script>
