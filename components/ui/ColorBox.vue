<template>
  <div
    class="h-[80px] w-[84px] rounded-[8px]"
    :style="{ backgroundColor: colors[props.color] }"
  />
</template>

<script setup lang="ts">
interface Props {
  color:
    | "black"
    | "light-gray-1"
    | "light-gray-2"
    | "gray-1"
    | "gray-2"
    | "dark-gray"
    | "white"
    | "red"
    | "blue"
    | "green"
    | "orange"
    | "purple";
}

const props = defineProps<Props>();

const colors = {
  black: "#000000",
  "light-gray-1": "#F5F5F5",
  "light-gray-2": "#EEEEEE",
  "gray-1": "#DDDDDD",
  "gray-2": "#AAAAAA",
  "dark-gray": "#4F4F4F",
  white: "#FFFFFF",
  red: "#FF1500",
  blue: "#6CCEFF",
  green: "#88FF47",
  orange: "#FF5900",
  purple: "#5500FF",
};
</script>
