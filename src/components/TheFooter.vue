<script setup lang="ts">
const version = __APP_VERSION__;
</script>

<template>
  <footer class="flex flex-row bg-white px-2 lg:px-4 dark:bg-gray-800 dark:text-white">
    <span class="mr-5">{{ version }}</span>
    <div
      id="footer-target"
      class="flex flex-row"
    />
  </footer>
</template>
