<template>
  <button
    type="button"
    class="flex h-5 w-5 items-center justify-center rounded-full border transition-colors"
    :class="[
      modelValue
        ? 'border-black bg-white hover:border-black'
        : 'hover:border-gray-2 border-[#D9D9D9]',
    ]"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div v-if="modelValue" class="h-2.5 w-2.5 rounded-full bg-black" />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();

defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>
