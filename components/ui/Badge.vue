<template>
  <div
    :class="[
      'flex min-w-6 justify-center rounded-full px-1.5 py-1 text-xs font-medium leading-4',
      {
        'bg-blue': props.color === BadgeColor.BLUE,
        'bg-green': props.color === BadgeColor.GREEN,
        'bg-orange': props.color === BadgeColor.ORANGE,
        'bg-purple': props.color === BadgeColor.PURPLE,
        'bg-black': props.color === BadgeColor.BLACK,
        'text-white': DARK_BACKGROUNDS.includes(
          props.color as
            | BadgeColor.BLACK
            | BadgeColor.ORANGE
            | BadgeColor.PURPLE,
        ),
        'text-black': !DARK_BACKGROUNDS.includes(
          props.color as
            | BadgeColor.BLACK
            | BadgeColor.ORANGE
            | BadgeColor.PURPLE,
        ),
      },
      $attrs.class || '',
    ]"
    v-bind="{ ...$attrs, class: undefined }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { BadgeColor } from "~/types/ui";

interface Props {
  color?: BadgeColor;
}

const props = withDefaults(defineProps<Props>(), {
  color: BadgeColor.BLUE,
});

defineOptions({
  inheritAttrs: false,
});

const DARK_BACKGROUNDS = [
  BadgeColor.BLACK,
  BadgeColor.ORANGE,
  BadgeColor.PURPLE,
] as const;
</script>
