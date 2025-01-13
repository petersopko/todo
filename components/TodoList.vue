<template>
  <div class="space-y-2">
    <TaskItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @update:completed="
        (id, completed) => emit('update:completed', id, completed)
      "
      @delete="(id) => emit('delete', id)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Todo, TodoListType } from "~/types/api";

defineProps<{
  todos: Todo[];
  type: TodoListType;
}>();

const emit = defineEmits<{
  "update:completed": [id: string, completed: boolean];
  delete: [id: string];
}>();
</script>
