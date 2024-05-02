<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useScroll } from '@/composables/scroll';

import BtnScrollToTop from '@/components/BtnScrollToTop.vue';
import TheHeader from '@/components/TheHeader.vue';

const { btnTopShow, scrollingProgress, observedElement, scrollTo, throttleScroll } = useScroll();

onMounted(() => {
	window.addEventListener('scroll', throttleScroll, { passive: true });
	observedElement.value = document.documentElement;
});

onBeforeUnmount(() => {
	window.removeEventListener('scroll', throttleScroll);
});

document.documentElement.classList.add('scrollbar-gutter');
</script>
<template>
  <div
    id="layout"
    class="min-h-full">
    <TheHeader class="sticky top-0 z-10" />
    <router-view
      :progress="scrollingProgress.progress"
      class="px-2 lg:px-4" />
    <BtnScrollToTop
      v-if="btnTopShow"
      class="fixed bottom-20 right-5 z-10 flex size-10 items-center justify-center"
      @click="scrollTo()" />
  </div>
</template>
