<template>
  <div ref="dropdownRef" class="relative">
    <!-- Trigger Button -->
    <Button
      :append-icon="true"
      :class="[isOpen ? 'border-dark-gray' : 'border-gray-3']"
      :icon-class="isOpen ? 'rotate-180' : ''"
      class="h-14 w-full justify-between border px-6"
      icon="CaretDown"
      variant="tertiary"
      @click="toggle"
    >
      <span
        class="text-2 text-left"
        :class="{ 'text-dark-gray-2': !modelValue }"
      >
        {{ displayText }}
      </span>
    </Button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="border-gray-3 absolute left-0 top-[60px] z-[100] w-full rounded-2xl border bg-white py-3"
      role="listbox"
      :aria-label="placeholder"
    >
      <div class="space-y-2 px-6">
        <label
          v-for="option in options"
          :key="option.value"
          class="flex w-full cursor-pointer items-center gap-4 py-1 transition-colors"
        >
          <Radio
            :model-value="modelValue === option.value"
            @update:model-value="onSelect(option.value)"
          />
          <span class="text-1">{{ option.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import Button from "./Button.vue";
import Radio from "./Radio.vue";

interface Option {
  value: string;
  label: string;
}

interface Props {
  modelValue: string;
  options: Option[];
  placeholder?: string;
}

interface Emits {
  "update:modelValue": [value: string];
  toggle: [];
  select: [value: string];
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select an option",
});

const emit = defineEmits<Emits>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLDivElement | null>(null);

const toggle = () => {
  isOpen.value = !isOpen.value;
  emit("toggle");
};

const close = () => {
  if (isOpen.value) {
    isOpen.value = false;
  }
};

onClickOutside(dropdownRef as unknown as HTMLElement, close);

const displayText = computed(() => {
  if (!props.modelValue) return props.placeholder;
  const option = props.options.find((opt) => opt.value === props.modelValue);
  return option?.label || props.placeholder;
});

const onSelect = (value: string) => {
  emit("update:modelValue", value);
  emit("select", value);
  close();
};
</script>
