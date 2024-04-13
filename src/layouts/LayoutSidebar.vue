<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useScroll } from '@/composables/scroll';

import TheSidebar from '@/components/TheSidebar.vue';
import BtnScrollToTop from '@/components/BtnScrollToTop.vue';

const sidebarCollapsed = ref(false);

const { btnTopShow, scrollingProgress, scrollTo, throttleScroll } = useScroll();

onMounted(() => {
	document.addEventListener('scroll', throttleScroll, { passive: true });
});
onBeforeUnmount(() => {
	document.removeEventListener('scroll', throttleScroll);
});
</script>
<template>
  <div
    id="layout"
    class="relative flex gap-2">
    <TheSidebar
      v-model="sidebarCollapsed"
      class="fixed left-0 top-0 h-full w-48 overflow-x-hidden overflow-y-scroll"
      :class="{ 'w-48': !sidebarCollapsed, 'w-12': sidebarCollapsed }" />
    <router-view
      :sidebar-collapsed="sidebarCollapsed"
      :progress="scrollingProgress.progress"
      class="relative"
      :class="{'left-48 w-[calc(100%_-_12rem)]': !sidebarCollapsed, 'left-12 w-[calc(100%_-_3rem)]': sidebarCollapsed}" />
    <BtnScrollToTop
      v-if="btnTopShow"
      class="fixed bottom-20 right-10 z-10 flex size-10 items-center justify-center"
      @click="scrollTo()" />
  </div>
</template>
