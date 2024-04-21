<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import IconBurger from '@/components/IconBurger.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';

const version = __APP_VERSION__;
const route = useRoute();
const dropdownShow = ref(false);

const routeName = computed(() => {
	return route.name ? route.name.toString() : 'undefiened';
});
const bookID = computed(() => {
	return ['book-view', 'comics-view'].includes(routeName.value) ? Number(route.params.id) : null;
});

watch(
	() => route.name,
	() => (dropdownShow.value = false),
);

function toggleDropdown() {
	dropdownShow.value = !dropdownShow.value;
}
</script>

<template>
  <header
    v-click-outside="() => (dropdownShow = false)"
    class="header flex h-[50px] flex-row items-center gap-2 bg-blue-600 px-2 dark:bg-gray-900 dark:text-white lg:px-4">
    <button
      class="h-full text-white lg:hidden"
      aria-label="Menu"
      @click="toggleDropdown">
      <IconBurger class="size-10 sm:size-12" :class="{ active: dropdownShow }" />
    </button>
    <ul
      class="absolute left-0 top-[50px] z-40 hidden w-full flex-row flex-wrap items-center bg-blue-500 text-white dark:bg-gray-900 lg:static lg:mr-4 lg:flex lg:flex-nowrap lg:gap-3 lg:bg-blue-600 dark:lg:bg-gray-900"
      :class="{ '!flex pb-3 ': dropdownShow }">
      <li class="w-full lg:w-fit">
        <router-link :to="{ name: 'books' }" class="header-link inline-block" active-class="header-link-active">
          Books
        </router-link>
      </li>
      <li class="w-full lg:w-fit">
        <router-link :to="{ name: 'tags' }" class="header-link inline-block" active-class="header-link-active">
          Tags
        </router-link>
      </li>
      <li class="w-full lg:w-fit">
        <router-link :to="{ name: 'authors' }" class="header-link inline-block" active-class="header-link-active">
          Authors
        </router-link>
      </li>
      <li class="w-full lg:w-fit">
        <router-link :to="{ name: 'series' }" class="header-link inline-block" active-class="header-link-active">
          Series
        </router-link>
      </li>
      <li class="w-full lg:w-fit">
        <router-link :to="{ name: 'media' }" class="header-link inline-block" active-class="header-link-active">
          Media
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
    <div id="menu-target" class="ml-auto flex h-full flex-row items-center gap-1 md:gap-3" />
    <RouterLink
      v-if="['book-view', 'comics-view'].includes(routeName)"
      :to="{ name: 'book-update', params: { id: bookID } }"
      class="sidebar-link flex items-center gap-2 rounded-md border"
      active-class="sidebar-link-active">
      <span>Update</span>
    </RouterLink>
  </header>
</template>
