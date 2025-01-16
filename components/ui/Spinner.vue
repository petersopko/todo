<!-- A simple spinner component with Tailwind classes -->
<template>
  <div
    :class="[
      'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]',
      sizeClasses[size],
      className,
    ]"
    role="status"
  >
    <span class="sr-only">{{ $t("common.loading") }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

withDefaults(defineProps<Props>(), {
  size: "md",
  className: "",
});

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};
</script>
