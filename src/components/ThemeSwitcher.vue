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
	<section class="flex flex-row items-center p-[2px] border-2 rounded-3xl text-white" aria-label="Color theme switcher">
		<button
			class="px-4 rounded-3xl border-0"
			aria-pressed="false"
			value="light"
			@click.passive="setTheme"
			:class="{ 'bg-black dark:bg-white dark:text-black': theme === 'light' }">
			Light
		</button>
		<button
			class="px-4 rounded-3xl border-0"
			aria-pressed="true"
			value="auto"
			:class="{ 'bg-black dark:bg-white dark:text-black': !theme }"
			@click.passive="setTheme">
			Auto
		</button>
		<button
			class="px-4 rounded-3xl border-0"
			aria-pressed="false"
			value="dark"
			@click.passive="setTheme"
			:class="{ 'bg-black dark:bg-white dark:text-black': theme === 'dark' }">
			Dark
		</button>
		<div class="theme-switcher__status"></div>
	</section>
</template>
