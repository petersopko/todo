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
        class="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2 lg:bottom-4"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex min-w-[300px] max-w-md items-center justify-between gap-3 rounded-lg px-4 py-3 text-black shadow-lg backdrop-blur-sm"
          :class="{
            'bg-red': toast.type === 'error',
            'bg-green': toast.type === 'success',
            'bg-orange': toast.type === 'info',
          }"
        >
          <div class="flex items-center gap-3">
            <PhosphorIcon
              :name="getIconForType(toast.type)"
              class="h-5 w-5 flex-shrink-0"
              weight="fill"
            />
            <p class="text-sm">{{ toast.message }}</p>
          </div>
          <Button
            variant="icon"
            icon="X"
            aria-label="Dismiss"
            class="!h-8 !w-8 !border-0 !bg-transparent text-black hover:!bg-white/10 hover:text-black"
            @click="
              toastStore.toasts = toastStore.toasts.filter(
                (t) => t.id !== toast.id,
              )
            "
          />
        </div>
      </TransitionGroup>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from "~/stores/toast";
import { storeToRefs } from "pinia";
import Button from "./Button.vue";

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
