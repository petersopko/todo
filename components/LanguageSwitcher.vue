<template>
  <div class="flex items-center gap-2">
    <button
      v-for="locale in languageStore.availableLocales"
      :key="locale.code"
      class="rounded-lg px-3 py-1 text-sm transition-all"
      :class="
        locale.code === languageStore.currentLocale
          ? 'bg-black text-white'
          : 'hover:bg-gray-1'
      "
      @click="languageStore.switchLocale(locale.code)"
    >
      {{ locale.code.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLanguageStore } from "~/stores/language";

const languageStore = useLanguageStore();
</script>
