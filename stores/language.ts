export const useLanguageStore = defineStore("language", () => {
  const { locale: currentLocale, locales } = useI18n();
  const router = useRouter();
  const route = useRoute();

  const availableLocales = computed(() =>
    locales.value.map((l) => ({
      code: l.code as "en" | "sk",
      name: l.code === "en" ? "English" : "Slovensky",
    })),
  );

  const switchLocale = async (code: "en" | "sk") => {
    const path = route.fullPath.replace(/^\/[^/]+/, "");

    currentLocale.value = code;
    const newPath = code === "en" ? path || "/" : `/${code}${path || "/"}`;
    await router.push(newPath);

    if (import.meta.client) {
      localStorage.setItem("preferredLocale", code);
    }
  };

  onMounted(() => {
    if (import.meta.client) {
      const savedLocale = localStorage.getItem("preferredLocale") as
        | "en"
        | "sk";
      if (savedLocale && savedLocale !== currentLocale.value) {
        switchLocale(savedLocale);
      }
    }
  });

  return {
    currentLocale,
    availableLocales,
    switchLocale,
  };
});
