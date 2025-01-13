<template>
  <div class="h-[calc(100vh-48px)] rounded-2xl bg-white">
    <div class="flex h-full flex-col px-6 py-10">
      <NavigationContent>
        <template #logo>
          <Logo class="mb-8 w-1/2" />
        </template>
      </NavigationContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesStore } from "~/stores/categories";

const categoriesStore = useCategoriesStore();

await categoriesStore.fetchCategories();
</script>
