<template>
  <div class="relative h-[88px]">
    <div class="flex h-full flex-col">
      <textarea
        :value="modelValue"
        class="text-2 h-full w-full resize-none rounded-[12px] border p-4 outline-none transition-colors"
        :class="[
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text',
          error
            ? 'border-red hover:border-red focus:border-red'
            : borderClasses,
          $attrs.class || '',
        ]"
        :disabled="disabled"
        :aria-label="ariaLabel"
        :placeholder="placeholder"
        v-bind="{ ...$attrs, class: undefined }"
        @input="
          $emit(
            'update:modelValue',
            ($event.target as HTMLTextAreaElement).value,
          )
        "
      />
      <span
        class="text-dark-gray-2 pointer-events-none absolute left-4 top-4 text-xs"
        :class="{ 'opacity-50': disabled }"
      >
      </span>
    </div>
    <span v-if="error" class="text-red absolute -bottom-5 left-4 text-xs">
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  ariaLabel?: string;
}

withDefaults(defineProps<Props>(), {
  placeholder: "What do you want to do?",
  disabled: false,
  error: undefined,
  ariaLabel: undefined,
});

defineEmits<{
  "update:modelValue": [value: string];
}>();

defineOptions({
  inheritAttrs: false,
});

const borderClasses = computed(() => {
  const classes = [
    "border-[#D9D9D9]",
    "hover:border-gray-2",
    "focus:border-dark-gray",
  ];
  return classes.join(" ");
});
</script>
