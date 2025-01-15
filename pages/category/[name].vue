<template>
  <ClientOnly>
    <div
      v-if="categoriesStore.isLoading"
      class="flex items-center justify-center p-4"
    >
      {{ $t("common.loading") }}
    </div>
    <div
      v-else-if="categoriesStore.error"
      class="text-red flex items-center justify-center p-4"
    >
      {{ $t("common.error") }}: {{ categoriesStore.error }}
    </div>
    <TodosView
      v-else-if="category"
      view-type="category"
      :category-id="category.id"
    />
    <div
      v-else-if="categoriesStore.initState === 'initialized'"
      class="flex items-center justify-center p-4"
    >
      {{ $t("common.notFound") }}
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { slugify } from "~/utils/url";

const route = useRoute();
const router = useRouter();
const categoriesStore = useCategoriesStore();
const { locale, t } = useI18n();

// Initialize categories if needed
if (categoriesStore.initState === "uninitialized") {
  await categoriesStore.fetchCategories();
}

// Get category by slugified name from the route
const category = computed(() => {
  const routeName = String(route.params.name);

  // Find category by comparing both original and translated slugified names
  return categoriesStore.items.find((cat) => {
    const originalSlug = slugify(cat.name.toLowerCase());
    const translatedSlug = slugify(
      t(`categories.${cat.name.toLowerCase()}`).toLowerCase(),
    );
    return routeName === originalSlug || routeName === translatedSlug;
  });
});

// Redirect to dashboard if category not found and data is loaded
watchEffect(() => {
  if (
    categoriesStore.initState === "initialized" &&
    !category.value &&
    !categoriesStore.isLoading
  ) {
    // Only add locale prefix for non-default locale (sk)
    const path = locale.value === "en" ? "/" : `/${locale.value}/`;
    router.replace(path);
  }
});
</script>
