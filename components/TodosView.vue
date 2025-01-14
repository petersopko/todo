<template>
  <div
    class="h-full px-4 pt-12 lg:h-[calc(100vh-48px)] lg:overflow-hidden lg:px-10"
  >
    <div class="relative z-10 mb-10">
      <div class="space-y-4">
        <div class="flex flex-row items-center gap-4">
          <h1 class="heading-1 font-bold">{{ greeting }} {{ firstName }}</h1>
          <span class="heading-2 text-gray-2">{{ dateString }}</span>
        </div>
      </div>
      <div
        class="pointer-events-none absolute -bottom-8 left-0 right-0 h-8 bg-transparent"
      />
    </div>

    <div class="scrollbar-hide h-[calc(100%-140px)] lg:overflow-y-auto">
      <div class="flex items-center gap-4">
        <h2 class="heading-2 font-bold">
          <template v-if="viewType === 'dashboard'">
            {{ $t("dashboard.tasksForToday") }}
          </template>
          <template v-else-if="viewType === 'category'">
            <ClientOnly>
              {{ $t("category.tasksInCategory", { category: categoryName }) }}
            </ClientOnly>
          </template>
          <template v-else-if="viewType === 'finished'">
            {{ $t("finishedTasks.title") }}
          </template>
        </h2>
        <ClientOnly>
          <Badge v-if="viewType !== 'finished'" :color="badgeColor">
            {{ filteredUncompletedTodos.length }}
          </Badge>
        </ClientOnly>
      </div>

      <div v-if="isLoading" class="mt-8 flex items-center justify-center py-4">
        {{ $t("dashboard.loading") }}
      </div>

      <template v-else>
        <div v-if="viewType !== 'finished'" class="mt-4">
          <TodoList
            :todos="filteredUncompletedTodos"
            :type="TodoListType.UNCOMPLETED"
            @update:completed="todosStore.updateTodoStatus"
            @reorder="handleReorder"
          />
        </div>

        <template v-if="completedTodosToShow.length > 0">
          <div
            v-if="viewType !== 'finished'"
            class="mt-8 flex items-center justify-start gap-4"
          >
            <h1 class="heading-2 font-bold">
              <ClientOnly>
                {{ $t("dashboard.finishedTasks") }}
              </ClientOnly>
            </h1>
            <ClientOnly>
              <Badge v-if="viewType === 'category'" :color="badgeColor">
                {{ filteredCompletedTodos.length }}
              </Badge>
            </ClientOnly>
          </div>
          <div class="mt-4">
            <TodoList
              :todos="completedTodosToShow"
              :type="
                viewType === 'dashboard'
                  ? TodoListType.RECENT_COMPLETED
                  : TodoListType.COMPLETED
              "
              @update:completed="todosStore.updateTodoStatus"
              @delete="todosStore.deleteTodo"
            />
            <NuxtLink
              v-if="viewType === 'dashboard'"
              :to="localePath('/finished')"
              class="text-2 inline-flex items-center gap-2 py-2"
            >
              {{ $t("dashboard.seeAllFinished") }}
            </NuxtLink>
          </div>
        </template>
      </template>

      <div class="h-32 lg:h-24" />
    </div>

    <Button
      icon="Plus"
      class="fixed bottom-4 left-12 right-12 lg:bottom-16 lg:left-auto lg:right-16"
      @click="showNewTaskModal = true"
    >
      {{ $t("newTask.title") }}
    </Button>

    <NewTaskModal
      v-model="showNewTaskModal"
      :initial-category-id="categoryId"
    />
  </div>
</template>

<script setup lang="ts">
import type { Todo } from "~/types/api";
import { TodoListType } from "~/types/api";
import { BadgeColor } from "~/types/ui";
import { useTodosStore } from "~/stores/todos";
import { useUserStore } from "~/stores/user";
import { useCategoriesStore } from "~/stores/categories";
import { storeToRefs } from "pinia";
import { hexToBadgeColor } from "~/utils/colors";
import { useTimeGreeting } from "~/composables/useTimeGreeting";
import { useLocalePath, useI18n } from "#imports";
import { useToastStore } from "~/stores/toast";

const props = defineProps<{
  viewType: "dashboard" | "category" | "finished";
  categoryId?: string;
}>();

const localePath = useLocalePath();
const { t } = useI18n();

const todosStore = useTodosStore();
const userStore = useUserStore();
const categoriesStore = useCategoriesStore();
const toastStore = useToastStore();

const { isLoading, completedTodos, uncompletedTodos, recentCompletedTodos } =
  storeToRefs(todosStore);
const { firstName } = storeToRefs(userStore);

const showNewTaskModal = ref(false);
const { greeting, dateString } = useTimeGreeting();
const isInitialized = ref(false);

const initializeData = async () => {
  if (isInitialized.value) return;

  isInitialized.value = true;

  try {
    const results = await Promise.allSettled([
      todosStore.fetchTodos(),
      categoriesStore.fetchCategories(),
    ]);

    const failures = results.filter((r) => r.status === "rejected");

    if (failures.length === 2) {
      toastStore.showError(t("errors.failedToLoadApp"));
    } else if (results[0].status === "rejected") {
      toastStore.showError(t("errors.failedToLoadTasks"));
    } else if (results[1].status === "rejected") {
      toastStore.showError(t("errors.failedToLoadCategories"));
    }
  } catch (error) {
    toastStore.showError(
      "An unexpected error occurred. Please refresh the page. " +
        JSON.stringify(error),
    );
  }
};

onMounted(async () => {
  await initializeData();
});

const category = computed(() =>
  props.categoryId ? categoriesStore.getCategoryById(props.categoryId) : null,
);

const categoryName = computed(() => {
  const cat = category.value;
  if (!cat) return "";
  return (
    categoriesStore.translatedCategories.find((c) => c.id === cat.id)?.name ||
    cat.name
  );
});

const badgeColor = computed(() => {
  if (props.viewType !== "category") return BadgeColor.BLACK;
  if (!category.value?.color) return BadgeColor.BLUE;
  return hexToBadgeColor(category.value.color);
});

const filteredCompletedTodos = computed(() =>
  props.viewType === "category"
    ? todosStore.getCompletedTodosByCategory(props.categoryId!)
    : completedTodos.value,
);

const filteredUncompletedTodos = computed(() =>
  props.viewType === "category"
    ? todosStore.getUncompletedTodosByCategory(props.categoryId!)
    : uncompletedTodos.value,
);

const completedTodosToShow = computed(() => {
  if (props.viewType === "finished") {
    return completedTodos.value;
  }
  return props.viewType === "dashboard"
    ? recentCompletedTodos.value
    : filteredCompletedTodos.value;
});

const handleReorder = (reorderedTodos: Todo[]) => {
  todosStore.reorderTodos([...completedTodos.value, ...reorderedTodos]);

  if (import.meta.client) {
    const ids = reorderedTodos.map((todo) => todo.id);
    localStorage.setItem("uncompletedTodosOrder", JSON.stringify(ids));
  }
};
</script>

<style>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
