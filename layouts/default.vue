<template>
  <div
    class="flex min-h-[100dvh] flex-col overflow-hidden bg-[#F5F5F5] pb-[env(safe-area-inset-bottom)]"
  >
    <div class="lg:hidden">
      <MobileNavbar />
    </div>

    <!-- Desktop Layout -->
    <div class="hidden lg:grid lg:grid-cols-12 lg:gap-6 lg:p-6">
      <DesktopSidebar class="col-span-5 lg:col-span-4 xl:col-span-3" />
      <main class="relative col-span-7 lg:col-span-8 xl:col-span-9">
        <ClientOnly>
          <LoadingOverlay
            :is-visible="loadingState.isAnyStoreLoading.value"
            :message="$t('common.loading')"
          />
        </ClientOnly>
        <slot />
      </main>
    </div>

    <!-- Mobile Content Area -->
    <div
      class="flex-1 overflow-auto px-4 pt-[calc(84px+env(safe-area-inset-top))] lg:hidden"
    >
      <ClientOnly>
        <LoadingOverlay
          :is-visible="loadingState.isAnyStoreLoading.value"
          :message="$t('common.loading')"
        />
      </ClientOnly>
      <slot />
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
const loadingState = useLoadingState();

// Log loading states for debugging
watch(
  () => loadingState.storeLoadingStates.value,
  (states) => {
    console.log("Store Loading States:", states);
  },
  { deep: true },
);

watch(
  () => loadingState.apiLoadingStates.value,
  (states) => {
    console.log("API Loading States:", states);
  },
  { deep: true },
);
</script>
