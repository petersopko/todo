import { ref } from "vue";
import type { Todo } from "~/types/api";

export function useDragAndDrop(reorderCallback: (items: Todo[]) => void) {
  const draggedIndex = ref<number | null>(null);
  const overIndex = ref<number | null>(null);
  const lastDropPosition = ref<number | null>(null);

  function onDragStart(e: DragEvent, index: number) {
    console.log("🟦 Drag Start:", { index });
    draggedIndex.value = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  }

  function onDragOver(e: DragEvent, index: number) {
    e.preventDefault();

    if (!e.currentTarget || draggedIndex.value === null) return;

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const dropThreshold = rect.height / 2;

    const willDropAt = offsetY < dropThreshold ? index : index + 1;

    if (willDropAt !== lastDropPosition.value) {
      console.log("🟨 Drop Position Changed:", {
        from: draggedIndex.value,
        to: willDropAt,
      });
      lastDropPosition.value = willDropAt;
    }

    overIndex.value = willDropAt;
  }

  function onDrop(items: Todo[]) {
    console.log("🟩 Drop:", {
      fromIndex: draggedIndex.value,
      toIndex: overIndex.value,
      currentOrder: items.map((t) => t.id),
    });

    if (draggedIndex.value === null || overIndex.value === null) return;

    const fromIndex = draggedIndex.value;
    const toIndex = overIndex.value;

    if (fromIndex !== toIndex) {
      const itemsCopy = items.slice();
      const [movedItem] = itemsCopy.splice(fromIndex, 1);
      const adjustedIndex = toIndex > fromIndex ? toIndex - 1 : toIndex;
      itemsCopy.splice(adjustedIndex, 0, movedItem);

      console.log("🟪 Reordering:", {
        fromIndex,
        toIndex,
        adjustedIndex,
        newOrder: itemsCopy.map((t) => t.id),
      });

      reorderCallback(itemsCopy);
    }

    draggedIndex.value = null;
    overIndex.value = null;
  }

  function onDragEnd() {
    draggedIndex.value = null;
    overIndex.value = null;
    lastDropPosition.value = null;
  }

  return {
    draggedIndex,
    overIndex,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDrop,
  };
}
