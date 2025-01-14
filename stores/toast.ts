type ToastType = "error" | "success" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);
  let nextId = 0;

  const show = (message: string, type: ToastType = "info") => {
    const id = nextId++;
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 3000);
  };

  const showError = (message: string) => show(message, "error");
  const showSuccess = (message: string) => show(message, "success");
  const showInfo = (message: string) => show(message, "info");

  return {
    toasts,
    show,
    showError,
    showSuccess,
    showInfo,
  };
});
