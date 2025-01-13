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
        <slot />
      </main>
    </div>

    <!-- Mobile Content Area -->
    <div
      class="flex-1 overflow-auto px-4 pt-[calc(84px+env(safe-area-inset-top))] lg:hidden"
    >
      <slot />
    </div>
    <Toast />
  </div>
</template>
