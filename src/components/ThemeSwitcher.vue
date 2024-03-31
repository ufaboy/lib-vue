<script setup lang="ts">
import { ref } from 'vue';

const theme = ref('');

function setTheme(e: Event) {
	const target = e.target as HTMLButtonElement;
	theme.value = target.value;
	if (target.value === 'dark') {
		localStorage.theme = 'dark';
		document.documentElement.classList.add('dark');
		document.documentElement.classList.remove('light');
	} else if (target.value === 'light') {
		document.documentElement.classList.add('light');
		document.documentElement.classList.remove('dark');
		localStorage.theme = 'light';
	} else {
		localStorage.removeItem('theme');
		document.documentElement.classList.remove('dark');
		document.documentElement.classList.remove('light');
		theme.value = '';
	}
}

function initTheme() {
	theme.value = localStorage.theme;
}

initTheme();
</script>

<template>
  <section
    class="flex flex-row items-center rounded-3xl border-2 p-[2px] text-white"
    aria-label="Color theme switcher">
    <button
      class="rounded-3xl border-0 px-4"
      aria-pressed="false"
      value="light"
      :class="{ 'bg-black dark:bg-white dark:text-black': theme === 'light' }"
      @click.passive="setTheme">
      Light
    </button>
    <button
      class="rounded-3xl border-0 px-4"
      aria-pressed="true"
      value="auto"
      :class="{ 'bg-black dark:bg-white dark:text-black': !theme }"
      @click.passive="setTheme">
      Auto
    </button>
    <button
      class="rounded-3xl border-0 px-4"
      aria-pressed="false"
      value="dark"
      :class="{ 'bg-black dark:bg-white dark:text-black': theme === 'dark' }"
      @click.passive="setTheme">
      Dark
    </button>
    <div class="theme-switcher__status" />
  </section>
</template>
