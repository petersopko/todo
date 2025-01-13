<template>
  <TodosView view-type="category" :category-id="String(route.params.id)" />
</template>

<script setup lang="ts">
const route = useRoute();
</script>
