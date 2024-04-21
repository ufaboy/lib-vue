<script setup lang="ts">
const version = __APP_VERSION__;
</script>

<template>
  <footer class="flex flex-row bg-white px-2 dark:bg-gray-800 dark:text-white lg:px-4">
    <span class="mr-5">
      {{ version }}
    </span>
    <div id="footer-target" class="flex flex-row" />
  </footer>
</template>
