<template>
  <ClientOnly>
    <div class="flex min-h-[100dvh] items-center justify-center">
      <div class="text-center">
        <h1 class="heading mb-4">{{ $t("errors.pageNotFound") }}</h1>
        <NuxtLink
          :to="localePath('/')"
          class="text-dark-gray hover:text-black hover:underline"
        >
          {{ $t("errors.backToHome") }}
        </NuxtLink>
      </div>
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">
const localePath = useLocalePath();
</script>
