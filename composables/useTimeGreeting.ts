import { useI18n } from "vue-i18n";

export function useTimeGreeting() {
  const { t } = useI18n();

  const timePeriod = useState("timePeriod", () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  });

  const formattedDate = useState("formattedDate", () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return { day, month, year };
  });

  const greeting = computed(() => t(`time.${timePeriod.value}`));
  const dateString = computed(() => t("time.dateFormat", formattedDate.value));

  return {
    greeting,
    dateString,
  };
}
