# todo app

## to launch:

```
bun install
bun dev
```

## project structure

```
todo

|-.gitignore
|-.prettierrc
|-README.md
|-assets
| |-css
| | |-fonts.css
| | |-typography.css
| |-fonts
| | |-DMSans.ttf
|-bun.lockb
|-components
| |-DesktopSidebar.vue
| |-LanguageSwitcher.vue
| |-MobileNavbar.vue
| |-NewTaskModal.vue
| |-TodoList.vue
| |-TodosView.vue
| |-navigation
| | |-NavigationContent.vue
| |-ui
| | |-Badge.vue
| | |-Button.vue
| | |-Checkbox.vue
| | |-ColorBox.vue
| | |-Dropdown.vue
| | |-Logo.vue
| | |-Modal.vue
| | |-PhosphorIcon.vue
| | |-Radio.vue
| | |-TaskItem.vue
| | |-TextField.vue
| | |-Toast.vue
|-composables
| |-useTimeGreeting.ts
|-data
| |-ui.ts
|-eslint.config.mjs
|-i18n
| |-locales
| | |-en.json
| | |-sk.json
|-layouts
| |-default.vue
|-nuxt.config.ts
|-package.json
|-pages
| |-category
| | |-[id].vue
| |-finished.vue
| |-index.vue
| |-ui-kit.vue
|-public
| |-favicon.ico
| |-logo.png
| |-robots.txt
|-server
| |-api
| | |-categories.get.ts
| | |-todos
| | | |-[id].delete.ts
| | | |-[id].patch.ts
| | | |-index.get.ts
| | | |-index.post.ts
| |-tsconfig.json
| |-utils
| | |-api.ts
|-stores
| |-categories.ts
| |-language.ts
| |-navigation.ts
| |-newTask.ts
| |-toast.ts
| |-todos.ts
| |-user.ts
|-tsconfig.json
|-types
| |-api.ts
| |-ui.ts
|-utils
| |-colors.ts
| |-errorHandling.ts

```
