<template>
  <img
    :src="src"
    alt="To Do App"
    class="object-contain"
    :class="$attrs.class || 'h-8'"
  >
</template>

<script setup lang="ts">
interface Props {
  src?: string;
}

withDefaults(defineProps<Props>(), {
  src: "/logo.png",
});

defineOptions({
  inheritAttrs: false,
});
</script>
