<template>
  <div class="min-h-screen bg-[#F5F5F5]">
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
    <div class="px-4 pt-[84px] lg:hidden">
      <slot />
    </div>
    <Toast />
  </div>
</template>
