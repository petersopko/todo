<template>
  <div class="space-y-2">
    <template v-if="type === TodoListType.UNCOMPLETED">
      <div
        v-for="(todo, index) in todos"
        :key="todo.id"
        :data-todo-id="todo.id"
        class="draggable-wrapper"
        :class="{
          'is-dragging': draggedIndex === index,
          'is-over': overIndex === index,
          'shift-up': draggedIndex !== null && index < (overIndex ?? 0),
          'shift-down': draggedIndex !== null && index >= (overIndex ?? 0),
        }"
        draggable="true"
        @dragstart="onDragStart($event, index)"
        @dragover.prevent="onDragOver($event, index)"
        @dragend="onDragEnd"
        @drop.prevent="onDrop"
      >
        <TaskItem
          :todo="todo"
          @update:completed="
            (id, completed) => $emit('update:completed', id, completed)
          "
          @delete="(id) => $emit('delete', id)"
        />
      </div>
      <div
        v-if="draggedIndex !== null && overIndex === todos.length"
        class="drop-placeholder"
      />
    </template>

    <template v-else>
      <TaskItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @update:completed="
          (id, completed) => $emit('update:completed', id, completed)
        "
        @delete="(id) => $emit('delete', id)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from "~/types/api";
import { TodoListType } from "~/types/api";
import { useDragAndDrop } from "~/composables/useDragAndDrop";

const props = defineProps<{
  todos: Todo[];
  type: TodoListType;
}>();

const emit = defineEmits<{
  "update:completed": [id: string, completed: boolean];
  delete: [id: string];
  reorder: [todos: Todo[]];
}>();

const { draggedIndex, overIndex, onDragStart, onDragOver, onDragEnd } =
  useDragAndDrop((reorderedTodos: Todo[]) => emit("reorder", reorderedTodos));

const onDrop = () => {
  const currentDraggedIndex = draggedIndex.value;
  const currentOverIndex = overIndex.value;

  if (currentDraggedIndex !== null && currentOverIndex !== null) {
    const newTodos = [...props.todos];
    const [draggedTodo] = newTodos.splice(currentDraggedIndex, 1);
    newTodos.splice(currentOverIndex, 0, draggedTodo);
    emit("reorder", newTodos);
  }
};
</script>

<style scoped>
.draggable-wrapper {
  position: relative;
  transition: all 0.2s ease;
  transition-delay: 0.05s;
}

.draggable-wrapper.is-dragging {
  opacity: 0.5;
  transform: scale(1.02);
}

.draggable-wrapper.shift-up {
  transform: translateY(-12px);
  transition: transform 0.2s ease;
}

.draggable-wrapper.shift-down {
  transform: translateY(12px);
  transition: transform 0.2s ease;
}

.drop-placeholder {
  height: 20px;
  transition: all 0.2s ease;
}

.draggable-wrapper:hover {
  cursor: grab;
}

.draggable-wrapper:active {
  cursor: grabbing;
}
</style>
