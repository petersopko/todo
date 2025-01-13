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
            @click="selectCategory(category.id)"
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
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import Button from "~/components/ui/Button.vue";
import LanguageSwitcher from "~/components/LanguageSwitcher.vue";
import { useCategoriesStore } from "~/stores/categories";
import { NavigationSection } from "~/types/api";

interface Props {
  onNavigate?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  onNavigate: undefined,
});

const router = useRouter();
const { locale } = useI18n();
const categoriesStore = useCategoriesStore();
const { isLoading, error, translatedCategories } = storeToRefs(categoriesStore);
const selectedSection = ref<NavigationSection>(NavigationSection.DASHBOARD);

const selectSection = (section: NavigationSection) => {
  selectedSection.value = section;
  switch (section) {
    case NavigationSection.DASHBOARD:
      router.push(`/${locale.value}/`);
      break;
    case NavigationSection.FINISHED:
      router.push(`/${locale.value}/finished`);
      break;
    case NavigationSection.UI_KIT:
      router.push(`/${locale.value}/ui-kit`);
      break;
  }
  props.onNavigate?.();
};

const selectCategory = (id: string) => {
  selectedSection.value = NavigationSection.CATEGORY;
  categoriesStore.selectCategory(id);
  router.push(`/${locale.value}/category/${id}`);
  props.onNavigate?.();
};

onMounted(() => {
  const route = useRoute();
  const path = route.fullPath.replace(/^\/[^/]+/, "");

  switch (path) {
    case "/finished":
      selectedSection.value = NavigationSection.FINISHED;
      break;
    case "/":
    case "":
      selectedSection.value = NavigationSection.DASHBOARD;
      break;
    default:
      if (path.startsWith("/category/")) {
        selectedSection.value = NavigationSection.CATEGORY;
      }
  }
});
</script>
