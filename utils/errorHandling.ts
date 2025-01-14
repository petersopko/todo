import type { FetchError } from "ofetch";
import { useToastStore } from "~/stores/toast";

export type ApiErrorResponse = {
  error: true;
  statusCode: number;
  message: string;
};

export type ApiSuccessResponse<T> = {
  data: T;
  error?: never;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export const isApiError = (error: unknown): error is ApiErrorResponse => {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    "statusCode" in error &&
    "message" in error
  );
};

export const isFetchError = (error: unknown): error is FetchError => {
  return error instanceof Error && "data" in error;
};

export const handleApiError = (error: unknown, defaultMessage: string) => {
  const toastStore = useToastStore();

  if (isApiError(error)) {
    toastStore.showError(error.message);
    return {
      error: true,
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  if (isFetchError(error)) {
    const message = error.data?.message || error.message || defaultMessage;
    toastStore.showError(message);
    return {
      error: true,
      message,
      statusCode: error.status || 500,
    };
  }

  if (error instanceof Error) {
    toastStore.showError(error.message);
    return {
      error: true,
      message: error.message,
      statusCode: 500,
    };
  }

  toastStore.showError(defaultMessage);
  return {
    error: true,
    message: defaultMessage,
    statusCode: 500,
  };
};
