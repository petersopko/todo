<template>
  <template v-if="name !== 'Dot'">
    <PhosphorIconPlus v-if="name === 'Plus'" v-bind="$attrs" />
    <PhosphorIconCheck v-if="name === 'Check'" v-bind="$attrs" />
    <PhosphorIconX v-if="name === 'X'" v-bind="$attrs" />
    <PhosphorIconTrash v-if="name === 'Trash'" v-bind="$attrs" />
    <PhosphorIconList v-if="name === 'Menu'" v-bind="$attrs" />
    <PhosphorIconCirclesFour v-if="name === 'CirclesFour'" v-bind="$attrs" />
    <PhosphorIconCheckSquare v-if="name === 'CheckSquare'" v-bind="$attrs" />
    <PhosphorIconCaretDown v-if="name === 'CaretDown'" v-bind="$attrs" />
    <PhosphorIconWarningCircle v-if="name === 'Warning'" v-bind="$attrs" />
    <PhosphorIconInfo v-if="name === 'Info'" v-bind="$attrs" />
    <PhosphorIconPalette v-if="name === 'Palette'" v-bind="$attrs" />
  </template>
  <div v-else v-bind="$attrs" />
</template>

<script setup lang="ts">
type IconName =
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

defineProps<{
  name: IconName;
}>();
</script>
