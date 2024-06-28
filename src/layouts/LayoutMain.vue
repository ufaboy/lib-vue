<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useScroll } from '@/composables/scroll';

import TheSidebar from '@/components/TheSidebar.vue';
import BtnScrollToTop from '@/components/BtnScrollToTop.vue';


const { btnTopShow, scrollingProgress, scrollTo, throttleScroll } = useScroll();

const route = useRoute();
const sidebarShow = ref(false);

watch(
  () => route.name,
  () => (sidebarShow.value = false),
);

onMounted(() => {
  document.addEventListener('scroll', throttleScroll, { passive: true });
});
onBeforeUnmount(() => {
  document.removeEventListener('scroll', throttleScroll);
});
document.documentElement.classList.add('scrollbar-gutter');
</script>
<template>
  <div id="layout" class="relative flex min-h-full flex-col lg:flex-row">
    <TheSidebar class="" :expanded="sidebarShow" @toggle-sidebar="sidebarShow = !sidebarShow" />
    <router-view :progress="scrollingProgress.progress" class="relative px-2 lg:left-40" />
    <BtnScrollToTop
      v-if="btnTopShow"
      class="fixed bottom-20 right-10 z-10 flex size-10 items-center justify-center"
      @click="scrollTo()" />
  </div>
</template>
