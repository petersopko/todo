<template>
  <div>
    <ClientOnly>
      <TransitionGroup
        tag="div"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-2 opacity-0"
        class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex min-w-[300px] max-w-md items-center justify-between gap-3 rounded-lg bg-gray-900/95 px-4 py-3 text-white shadow-lg backdrop-blur-sm"
          :class="{
            'border-l-4 border-red-500': toast.type === 'error',
            'border-l-4 border-green-500': toast.type === 'success',
            'border-l-4 border-blue-500': toast.type === 'info',
          }"
        >
          <div class="flex items-center gap-3">
            <PhosphorIcon
              :name="getIconForType(toast.type)"
              class="h-5 w-5 flex-shrink-0"
              :class="{
                'text-red-500': toast.type === 'error',
                'text-green-500': toast.type === 'success',
                'text-blue-500': toast.type === 'info',
              }"
              weight="fill"
            />
            <p class="text-sm">{{ toast.message }}</p>
          </div>
          <button
            class="flex-shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            type="button"
            aria-label="Dismiss"
            @click="
              toastStore.toasts = toastStore.toasts.filter(
                (t) => t.id !== toast.id,
              )
            "
          >
            <PhosphorIcon name="X" class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from "~/stores/toast";
import { storeToRefs } from "pinia";

type ToastType = "error" | "success" | "info";

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);

const getIconForType = (type: ToastType): "Info" | "Warning" | "Check" => {
  switch (type) {
    case "error":
      return "Warning";
    case "success":
      return "Check";
    default:
      return "Info";
  }
};
</script>
