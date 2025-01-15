// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "nuxt-phosphor-icons",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/eslint",
    "@vueuse/nuxt",
  ],
  components: {
    dirs: [
      {
        path: "~/components",
        pathPrefix: false,
      },
    ],
  },
  i18n: {
    locales: [
      {
        code: "en",
        file: "en.json",
      },
      {
        code: "sk",
        file: "sk.json",
      },
    ],
    lazy: false,
    langDir: "./locales",
    defaultLocale: "en",
    strategy: "prefix_except_default",
    customRoutes: "config",
    pages: {
      "category/[name]": {
        sk: "/kategorie/[name]",
      },
      finished: {
        sk: "/dokoncene",
      },
    },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/fonts.css", "~/assets/css/typography.css"],
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL,
    apiAccessToken: process.env.NUXT_API_ACCESS_TOKEN,
    public: {},
  },
  tailwindcss: {
    config: {
      theme: {
        fontFamily: {
          sans: ["DM Sans", "sans-serif"],
        },
        fontSize: {
          xs: ["12px", "15.62px"],
          sm: ["14px", "18.23px"],
          base: ["16px", "20px"],
          lg: ["18px", "24px"],
          xl: ["20px", "26px"],
          "2xl": ["40px", "52px"],
          "2xl-ui": ["40px", "52.08px"],
        },
        letterSpacing: {
          heading: "2px",
          label: "2px",
        },
        extend: {
          colors: {
            black: "#000000",
            "light-gray-1": "#F5F5F5",
            "light-gray-2": "#F6F6F6",
            "gray-1": "#F6F6F6",
            "gray-2": "#AAAAAA",
            "gray-3": "#DEDEDE",
            "gray-4": "#D6D6D6",
            "gray-5": "#DBDBDB",
            "dark-gray": "#4F4F4F",
            "dark-gray-2": "#757575",
            white: "#FFFFFF",
            red: "#FF1500",
            blue: "#6CCEFF",
            green: "#88FF47",
            orange: "#FF5900",
            purple: "#5500FF",
          },
          boxShadow: {
            button: "0px 7px 12.7px 0px #0000004D",
          },
        },
      },
      extend: {
        ".scrollbar-hide": {
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
        },
      },
    },
  },
});
