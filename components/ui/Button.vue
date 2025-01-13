<template>
  <button
    type="button"
    :class="[
      'transition-colors disabled:opacity-50',
      variant === 'primary' &&
        'hover:shadow-button flex items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-white transition-all disabled:opacity-50 disabled:hover:shadow-none',
      variant === 'secondary' &&
        'hover:border-gray-2 disabled:hover:border-gray-3 border-gray-3 flex items-center justify-center gap-2 rounded-full border bg-white px-6 py-4 text-black transition-colors disabled:opacity-50',
      variant === 'tertiary' &&
        'hover:border-gray-4 flex h-10 flex-row items-center justify-start rounded-full bg-white px-10 transition-all hover:border',
      variant === 'ternary' && [
        'flex h-12 w-full items-center gap-3.5 rounded-full px-6 transition-all',
        active ? 'bg-light-gray-2' : 'hover:bg-gray-1 bg-[#F6F6F6]',
      ],
      variant === 'icon' &&
        `flex h-10 w-10 items-center justify-center ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} border-gray-5 border bg-white`,
      $attrs.class || '',
    ]"
    :disabled="disabled"
    :aria-label="ariaLabel"
    v-bind="{ ...$attrs, class: undefined }"
  >
    <slot name="prepend">
      <PhosphorIcon
        v-if="icon && !appendIcon"
        :name="icon"
        :class="[
          icon === 'Dot' ? 'h-2.5 w-2.5 rounded bg-black' : 'text-2 h-5 w-5',
          icon === 'CaretDown' && 'transition-transform duration-200',
          iconClass,
        ]"
      />
    </slot>

    <span v-if="variant !== 'icon'" class="text-2">
      <slot />
    </span>

    <slot name="append">
      <PhosphorIcon
        v-if="icon && appendIcon"
        :name="icon"
        :class="[
          'text-2 h-5 w-5',
          icon === 'Dot' && 'h-2.5 w-2.5 rounded bg-black',
          variant === 'icon' && icon !== 'Dot' && 'stroke-[1.5px]',
          icon === 'CaretDown' && 'transition-transform duration-200',
          iconClass,
        ]"
      />
    </slot>
  </button>
</template>

<script setup lang="ts">
import PhosphorIcon from "./PhosphorIcon.vue";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "ternary" | "icon";
type ButtonShape = "default" | "circle" | "square";
type Icon =
  | "Plus"
  | "Check"
  | "X"
  | "Trash"
  | "Menu"
  | "Dot"
  | "CirclesFour"
  | "CheckSquare"
  | "CaretDown"
  | "Warning"
  | "Info"
  | "Palette";

interface Props {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  icon?: Icon;
  iconClass?: string;
  appendIcon?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  active?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  shape: "default",
  disabled: false,
  icon: undefined,
  iconClass: "",
  appendIcon: false,
  ariaLabel: undefined,
  active: false,
});

defineOptions({
  inheritAttrs: false,
});
</script>
