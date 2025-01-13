import { defineStore } from "pinia";

export const useNavigationStore = defineStore("navigation", () => {
  const isMobileMenuOpen = ref(false);

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
  };

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };

  return {
    isMobileMenuOpen,
    closeMobileMenu,
    toggleMobileMenu,
  };
});
