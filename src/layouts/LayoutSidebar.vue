<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useScroll } from '@/composables/scroll';

import TheSidebar from '@/components/TheSidebar.vue';
import BtnScrollToTop from '@/components/BtnScrollToTop.vue';

const { btnTopShow, scrollingProgress, scrollTo, throttleScroll } = useScroll();

onMounted(() => {
  document.addEventListener('scroll', throttleScroll, { passive: true });
});
onBeforeUnmount(() => {
  document.removeEventListener('scroll', throttleScroll);
});
document.documentElement.classList.add('scrollbar-gutter');
</script>
<template>
  <div id="layout" class="relative flex min-h-full gap-2">
    <TheSidebar class="fixed left-0 top-0 z-10 h-full w-48 overflow-x-hidden overflow-y-scroll dark:bg-gray-900" />
    <router-view :progress="scrollingProgress.progress" class="relative left-48 w-[calc(100%_-_12rem)] pl-5 pr-1" />
    <BtnScrollToTop
      v-if="btnTopShow"
      class="fixed bottom-20 right-10 z-10 flex size-10 items-center justify-center"
      @click="scrollTo()" />
  </div>
</template>
