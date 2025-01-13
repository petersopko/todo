<template>
  <div>
    <div
      class="fixed left-0 right-0 top-0 z-40 m-6 flex h-[72px] items-center justify-between bg-white p-6 transition-all duration-200"
      :class="{
        'rounded-t-lg': isMenuOpen,
        'rounded-lg shadow': !isMenuOpen,
      }"
    >
      <NuxtLink to="/" @click="isMenuOpen = false">
        <Logo class="h-8" />
      </NuxtLink>
      <Button
        variant="icon"
        shape="square"
        icon="Menu"
        @click="isMenuOpen = !isMenuOpen"
      />
    </div>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-[0.98]"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-[0.98]"
    >
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-30 bg-black/50"
        @click="isMenuOpen = false"
      >
        <div
          class="fixed left-0 right-0 top-[72px] m-6 origin-top overflow-auto rounded-b-lg bg-white shadow-lg"
          @click.stop
        >
          <div class="flex h-[calc(100vh-132px)] flex-col px-6 py-10">
            <NavigationContent :on-navigate="() => (isMenuOpen = false)">
            </NavigationContent>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCategoriesStore } from "~/stores/categories";

const isMenuOpen = ref(false);
const categoriesStore = useCategoriesStore();

await categoriesStore.fetchCategories();
</script>
