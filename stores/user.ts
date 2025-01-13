import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface User {
  first_name: string;
  last_name: string;
}

export const useUserStore = defineStore("user", () => {
  const currentUser = ref<User | null>(null);

  const firstName = computed(() => currentUser.value?.first_name || "");
  const lastName = computed(() => currentUser.value?.last_name || "");
  const fullName = computed(() => {
    if (!currentUser.value) return "";
    return `${currentUser.value.first_name} ${currentUser.value.last_name}`;
  });

  function setUser(user: User) {
    currentUser.value = user;
  }

  return {
    currentUser,
    firstName,
    lastName,
    fullName,
    setUser,
  };
});
