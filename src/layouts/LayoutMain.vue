<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import TheHeader from '@/components/TheHeader.vue';

const isThrottledScroll = ref(false);
const progress = ref(0);
const btnTopShow = ref(false);

function throttleScroll() {
  if (isThrottledScroll.value) {
    return;
  }
  isThrottledScroll.value = true;
  setTimeout(() => {
    isThrottledScroll.value = false;
    handleScroll();
  }, 300);
}

function handleScroll() {
  progress.value = Math.floor(
    (document.documentElement.scrollTop * 100) /
      document.documentElement.scrollHeight
  );
  btnTopShow.value = window.scrollY > 100;
}

onMounted(() => {
  window.addEventListener('scroll', throttleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', throttleScroll);
});

document.documentElement.classList.add('scrollbar');
</script>
<template>
  <div class="layout">
    <TheHeader class="sticky top-0 z-10" />
    <router-view :scroll-progress="progress" />
    <div
      class="group fixed bottom-20 right-5 z-10 flex size-10 items-center justify-center"
    >
      <a
        id="scrollUp"
        href="#top"
        title="Scroll to top"
        class="rounded-full dark:bg-slate-900 border shadow-sm transition-all group-hover:animate-bounce"
        :class="{ visibility: btnTopShow, invisible: !btnTopShow }"
      >
        <svg class="size-6">
          <use xlink:href="/icons/iconSprite.svg#arrowUpward" />
        </svg>
      </a>
    </div>
  </div>
</template>
