import type { FetchError } from "ofetch";
import { useToastStore } from "~/stores/toast";

export const handleApiError = (error: unknown, defaultMessage: string) => {
  const toastStore = useToastStore();

  if (error instanceof Error) {
    const fetchError = error as FetchError;
    const message =
      fetchError.data?.message || fetchError.message || defaultMessage;

    toastStore.showError(message);

    return {
      error: true,
      message,
    };
  }

  toastStore.showError(defaultMessage);

  return {
    error: true,
    message: defaultMessage,
  };
};
