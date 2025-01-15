<template>
  <div class="flex h-full flex-col">
    <slot name="logo" />

    <!-- Dashboard -->
    <div>
      <Button
        variant="ternary"
        icon="CirclesFour"
        @click="selectSection(NavigationSection.DASHBOARD)"
      >
        {{ $t("navigation.dashboard") }}
      </Button>
    </div>

    <!-- Categories Label -->
    <div class="mt-2 flex w-full items-center px-10 pt-4">
      <span class="label">{{ $t("navigation.yourCategories") }}</span>
    </div>

    <div class="flex flex-col gap-2 pt-4">
      <ClientOnly>
        <div v-if="isLoading" class="">
          {{ $t("common.loading") }}
        </div>
        <div
          v-else-if="error"
          class="text-red my-4 mt-2 flex w-full flex-col items-start px-10 pt-4"
        >
          <span class="text-red">{{ $t("common.error") }}</span>
          <span class="text-red">{{ error }}</span>
        </div>
        <template v-else>
          <Button
            v-for="category in translatedCategories"
            :key="category.id"
            variant="tertiary"
            icon="Dot"
            class="w-full flex-nowrap gap-3.5 whitespace-nowrap"
            @click="selectCategory(category)"
          >
            <span class="text-1 truncate">{{ category.name }}</span>
          </Button>
        </template>
      </ClientOnly>
    </div>

    <!-- Finished Tasks -->
    <div class="mt-2">
      <Button
        variant="ternary"
        icon="CheckSquare"
        @click="selectSection(NavigationSection.FINISHED)"
      >
        {{ $t("navigation.finishedTasks") }}
      </Button>
    </div>

    <!-- UI Kit -->
    <div class="mt-2">
      <Button
        variant="ternary"
        icon="Palette"
        @click="selectSection(NavigationSection.UI_KIT)"
      >
        {{ $t("navigation.uikit") }}
      </Button>
    </div>

    <!-- Language Switcher -->
    <div class="mt-auto flex justify-center pt-4">
      <LanguageSwitcher />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import Button from "~/components/ui/Button.vue";
import LanguageSwitcher from "~/components/LanguageSwitcher.vue";
import { useCategoriesStore } from "~/stores/categories";
import { NavigationSection } from "~/types/api";
import type { Category } from "~/types/api";
import { slugify } from "~/utils/url";

interface Props {
  onNavigate?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  onNavigate: undefined,
});

const router = useRouter();
const { t } = useI18n();
const categoriesStore = useCategoriesStore();
const { isLoading, error, translatedCategories } = storeToRefs(categoriesStore);
const selectedSection = ref<NavigationSection>(NavigationSection.DASHBOARD);

const selectSection = (section: NavigationSection) => {
  selectedSection.value = section;
  const localePath = useLocalePath();

  switch (section) {
    case NavigationSection.DASHBOARD:
      router.push(localePath("/"));
      break;
    case NavigationSection.FINISHED:
      router.push(localePath({ name: "finished" }));
      break;
    case NavigationSection.UI_KIT:
      router.push(localePath("/ui-kit"));
      break;
  }
  props.onNavigate?.();
};

const selectCategory = (category: Category) => {
  selectedSection.value = NavigationSection.CATEGORY;
  categoriesStore.selectCategory(category.id);

  // Get the original category from the store to use its untranslated name
  const originalCategory = categoriesStore.items.find(
    (c) => c.id === category.id,
  );
  if (!originalCategory) return;

  const translatedName = t(`categories.${originalCategory.name.toLowerCase()}`);

  const localePath = useLocalePath();
  const targetPath = localePath({
    name: "category-name",
    params: { name: slugify(translatedName.toLowerCase()) },
  });

  router.push(targetPath).catch(() => {});

  props.onNavigate?.();
};

onMounted(() => {
  const route = useRoute();
  const path = route.fullPath.replace(/^\/[^/]+/, "");
  const cleanPath = path.replace(/\/$/, "");

  switch (cleanPath) {
    case "/finished":
    case "/dokoncene":
      selectedSection.value = NavigationSection.FINISHED;
      break;
    case "":
      selectedSection.value = NavigationSection.DASHBOARD;
      break;
    case "/ui-kit":
      selectedSection.value = NavigationSection.UI_KIT;
      break;
    default:
      if (
        cleanPath.startsWith("/category/") ||
        cleanPath.startsWith("/kategorie/")
      ) {
        selectedSection.value = NavigationSection.CATEGORY;
      }
  }
});
</script>
