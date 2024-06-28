<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import IconBurger from '@/components/IconBurger.vue';

const emit = defineEmits(['toggleSidebar']);
const props = defineProps({
  expanded: Boolean
})

const route = useRoute()

const routeName = computed(() => {
  return route.name ? route.name.toString() : 'undefiened'
})
const bookID = computed(() => {
  return ['book-view', 'comics-view'].includes(routeName.value) ? Number(route.params.id) : null
})
</script>

<template>
  <div class="sticky top-0 z-30 flex h-8 w-full items-center px-3 dark:bg-gray-900 dark:text-white lg:hidden">
    <button class="" @click="$emit('toggleSidebar')">
      <IconBurger class="size-6" :class="{ active: expanded }" />
    </button>
    <div id="header-target" class="ml-auto flex items-center gap-1 md:gap-3" />
  </div>

  <aside
    v-bind="$attrs"
    class="fixed -left-40 top-0 z-20 lg:left-0 h-full w-40 bg-white pt-8 lg:pt-0 shadow transition dark:bg-gray-900 dark:text-white"
    :class="{'translate-x-40': expanded}">
    <ul
      class=" gap-3 ">
      <li class="w-full">
        <RouterLink
          :to="{ name: 'books' }"
          class="sidebar-link flex items-center gap-2 px-2 py-1"
          active-class="sidebar-link-active">
          <svg class="inline size-6">
            <use xlink:href="/icons/iconSprite.svg#books" />
          </svg>
          <span>Books</span>
        </RouterLink>
      </li>
      <li class="w-full">
        <RouterLink
          :to="{ name: 'tags' }"
          class="sidebar-link flex items-center gap-2"
          active-class="sidebar-link-active">
          <svg class="inline size-6" fill="none">
            <use xlink:href="/icons/iconSprite.svg#tag" />
          </svg>
          <span>Tags</span>
        </RouterLink>
      </li>
      <li class="w-full">
        <RouterLink
          :to="{ name: 'authors' }"
          class="sidebar-link flex items-center gap-2"
          active-class="sidebar-link-active">
          <svg class="inline size-6" fill="none">
            <use xlink:href="/icons/iconSprite.svg#authors" />
          </svg>
          <span>Authors</span>
        </RouterLink>
      </li>
      <li class="w-full">
        <RouterLink
          :to="{ name: 'series' }"
          class="sidebar-link flex items-center gap-2"
          active-class="sidebar-link-active">
          <svg class="inline size-6" fill="none">
            <use xlink:href="/icons/iconSprite.svg#series" />
          </svg>
          <span>Series</span>
        </RouterLink>
      </li>
      <li class="w-full">
        <RouterLink
          :to="{ name: 'media' }"
          class="sidebar-link flex items-center gap-2"
          active-class="sidebar-link-active">
          <svg class="inline size-6" fill="none">
            <use xlink:href="/icons/iconSprite.svg#photoLibrary" />
          </svg>
          <span>Media</span>
        </RouterLink>
      </li>
      <template v-if="route.name === 'books'">
        <hr class="my-1">
        <li class="w-full">
          <RouterLink
            :to="{ name: 'book-create' }"
            class="sidebar-link flex items-center gap-2"
            active-class="sidebar-link-active">
            <svg class="inline size-6" fill="none">
              <use xlink:href="/icons/iconSprite.svg#bookAdd" />
            </svg>
            <span>Create</span>
          </RouterLink>
        </li>
      </template>
      <template v-if="route.name === 'book-update'">
        <hr class="my-1">
        <li class="w-full">
          <RouterLink
            :to="{ name: 'book-view' }"
            class="sidebar-link flex items-center gap-2"
            active-class="sidebar-link-active">
            <svg class="inline size-6" fill="none">
              <use xlink:href="/icons/iconSprite.svg#openBook" />
            </svg>
            <span>View</span>
          </RouterLink>
        </li>
      </template>
      <template v-if="['book-view', 'comics-view'].includes(routeName)">
        <hr class="my-1">
        <li class="w-full">
          <RouterLink
            :to="{ name: 'book-update', params: { id: bookID } }"
            class="sidebar-link flex items-center gap-2"
            active-class="sidebar-link-active">
            <svg class="inline size-6" fill="none">
              <use xlink:href="/icons/iconSprite.svg#openBook" />
            </svg>
            <span>Update</span>
          </RouterLink>
        </li>
      </template>
      <hr class="my-1">

      <!-- 			<li class="px-4">
				<ThemeSwitcher />
			</li> -->
    </ul>
    <div id="menu-target" class="mt-4 flex flex-wrap items-center gap-3 px-2" />
  </aside>
</template>
