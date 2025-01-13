<template>
  <div class="group flex items-center gap-4 rounded-xl bg-white p-4">
    <Checkbox v-model="isCompleted" @update:model-value="onToggleComplete" />
    <div class="flex flex-1 items-center gap-4">
      <span
        class="text-1"
        :class="{ 'text-gray-2 line-through': todo.is_completed }"
      >
        {{ todo.todo }}
      </span>
      <Badge :color="badgeColor">{{ todo.category.name }}</Badge>
    </div>
    <div class="flex h-10 w-10 items-center justify-center">
      <Button
        v-if="todo.is_completed"
        variant="icon"
        shape="square"
        icon="Trash"
        class="hover:border-red hover:text-red hover:text-4 hover:border-2"
        @click="$emit('delete', todo.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Todo } from "~/types/api";
import Badge from "./Badge.vue";
import Button from "./Button.vue";
import Checkbox from "./Checkbox.vue";
import { hexToBadgeColor } from "~/utils/colors";

interface Props {
  todo: Todo;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:completed", id: string, completed: boolean): void;
  (e: "delete", id: string): void;
}>();

const isCompleted = ref(props.todo.is_completed);
const badgeColor = computed(() => hexToBadgeColor(props.todo.category.color));

watch(
  () => props.todo.is_completed,
  (newValue) => {
    isCompleted.value = newValue;
  },
);

const onToggleComplete = (completed: boolean) => {
  emit("update:completed", props.todo.id, completed);
};
</script>
