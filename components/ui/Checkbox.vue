<template>
  <button
    type="button"
    :class="[
      'flex h-6 w-6 items-center justify-center rounded-[6px] border transition-colors',
      modelValue
        ? 'hover:border-dark-gray hover:bg-dark-gray border-black bg-black'
        : 'border-gray-3 hover:border-gray-2',
    ]"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <PhosphorIcon v-if="modelValue" name="Check" class="h-4 w-4 text-white" />
  </button>
</template>

<script setup lang="ts">
import PhosphorIcon from "./PhosphorIcon.vue";

interface Props {
  modelValue: boolean;
}

interface Emits {
  "update:modelValue": [value: boolean];
}

defineProps<Props>();
defineEmits<Emits>();
</script>
