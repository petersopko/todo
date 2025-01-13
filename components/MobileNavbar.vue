<template>
  <div class="relative">
    <div
      class="fixed left-0 right-0 top-[env(safe-area-inset-top)] z-40 m-6 flex h-[72px] items-center justify-between bg-white p-6 transition-all duration-200"
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

    <div
      class="fixed inset-0 z-30"
      :style="{
        paddingTop: 'env(safe-area-inset-top)',
        display: isMenuOpen ? 'block' : 'none',
      }"
    >
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-[0.98]"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-[0.98]"
      >
        <div v-if="isMenuOpen" class="h-full w-full">
          <div class="h-full w-full bg-black/50" @click="isMenuOpen = false">
            <div
              class="fixed left-0 right-0 top-[calc(72px+env(safe-area-inset-top))] m-6 origin-top overflow-auto rounded-b-lg bg-white shadow-lg"
              @click.stop
            >
              <div
                class="flex flex-col px-6 py-10"
                :style="{
                  height: `calc(100dvh - 72px - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 48px)`,
                }"
              >
                <NavigationContent :on-navigate="() => (isMenuOpen = false)" />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCategoriesStore } from "~/stores/categories";

const isMenuOpen = ref(false);
const categoriesStore = useCategoriesStore();

await categoriesStore.fetchCategories();
</script>
