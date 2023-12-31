<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import IconBurger from '@/components/IconBurger.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';

const version = __APP_VERSION__;
const route = useRoute();
const dropdownShow = ref(false);

watch(
	() => route.name,
	() => (dropdownShow.value = false),
);
</script>

<template>
	<header class="header flex h-[50px] flex-row items-center gap-2 bg-blue-600 px-2 lg:px-4 dark:bg-gray-900 dark:text-white">
		<button class="h-full text-white lg:hidden" aria-label="Menu" @click="dropdownShow = !dropdownShow">
			<IconBurger class="size-10 sm:size-12" :class="{ active: dropdownShow }" />
		</button>
		<ul
			class="absolute left-0 top-[50px] z-10 hidden w-full flex-row flex-wrap items-center bg-blue-500 text-white lg:static lg:mr-4 lg:flex lg:flex-nowrap lg:gap-3 lg:bg-blue-600 dark:bg-gray-900 dark:lg:bg-gray-900"
			:class="{ '!flex pb-3 ': dropdownShow }">
			<li class="w-full lg:w-fit">
				<router-link
					:to="{ name: 'book-list' }"
					class="header-link inline-block lg:hidden"
					active-class="header-link-active">
					Books
				</router-link>
				<router-link
					:to="{ name: 'book-table' }"
					class="header-link hidden lg:inline-block"
					active-class="header-link-active">
					Books
				</router-link>
			</li>
			<li class="w-full lg:w-fit">
				<router-link :to="{ name: 'tag-list' }" class="header-link inline-block" active-class="header-link-active">
					Tags
				</router-link>
			</li>
			<li class="w-full lg:w-fit">
				<router-link :to="{ name: 'author-list' }" class="header-link inline-block" active-class="header-link-active">
					Authors
				</router-link>
			</li>
			<li class="w-full lg:w-fit">
				<router-link :to="{ name: 'series-list' }" class="header-link inline-block" active-class="header-link-active">
					Series
				</router-link>
			</li>
			<li class="w-full lg:w-fit">
				<router-link :to="{ name: 'images-table' }" class="header-link inline-block" active-class="header-link-active">
					Images
				</router-link>
			</li>
			<li class="w-full lg:w-fit">
				<div class="px-6 py-2">
					{{ version }}
				</div>
			</li>
			<li class="px-4">
				<ThemeSwitcher />
			</li>
		</ul>
		<div id="header-target" class="ml-auto flex h-full flex-row items-center gap-1 md:gap-3"></div>
	</header>
</template>
