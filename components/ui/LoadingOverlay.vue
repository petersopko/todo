<template>
  <div
    v-if="isVisible"
    class="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
  >
    <div class="flex flex-col items-center gap-3">
      <Spinner size="lg" class-name="text-primary" />
      <span class="text-sm text-gray-600">{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean;
  message?: string;
}

defineProps<Props>();
</script>
