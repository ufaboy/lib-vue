<script setup lang="ts">
import { computed, defineModel } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import ThemeSwitcher from '@/components/ThemeSwitcher.vue';

const route = useRoute()
const collapsed = defineModel({ type: Boolean});

const routeName = computed(()=> {
	return route.name ? route.name.toString() : 'undefiened'
})
const bookID = computed(()=> {
	return ['book-view', 'comics-view'].includes(routeName.value) ? Number(route.params.id) : null
})
</script>

<template>
  <aside
    class="border-r"
    :class="{ 'w-40': !collapsed, 'w-12': collapsed }">
    <button
      class="p-2 text-white"
      aria-label="Menu"
      @click="collapsed = !collapsed">
      <svg
        aria-hidden="true"
        role="status"
        class="inline size-6"
        fill="none">
        <use
          v-if="!collapsed"
          xlink:href="/icons/iconSprite.svg#sidebarClose" />
        <use
          v-else
          xlink:href="/icons/iconSprite.svg#sidebarOpen" />
      </svg>
    </button>
    <ul class="w-full gap-3 bg-blue-500 text-white dark:bg-gray-900 lg:bg-blue-600 dark:lg:bg-gray-900">
      <li class="w-full">
        <RouterLink
          :to="{ name: 'books' }"
          class="sidebar-link flex items-center gap-2 px-2 py-1"
          active-class="sidebar-link-active">
          <svg class="inline size-6">
            <use xlink:href="/icons/iconSprite.svg#books" />
          </svg>
          <span v-show="!collapsed">Books</span>
        </RouterLink>
      </li>
      <li class="w-full">
        <RouterLink
          :to="{ name: 'tags' }"
          class="sidebar-link flex items-center gap-2"
          active-class="sidebar-link-active">
          <svg
            class="inline size-6"
            fill="none">
            <use xlink:href="/icons/iconSprite.svg#tag" />
          </svg>
          <span v-show="!collapsed">Tags</span>
        </RouterLink>
      </li>
      <li class="w-full">
        <RouterLink
          :to="{ name: 'authors' }"
          class="sidebar-link flex items-center gap-2"
          active-class="sidebar-link-active">
          <svg
            class="inline size-6"
            fill="none">
            <use xlink:href="/icons/iconSprite.svg#authors" />
          </svg>
          <span v-show="!collapsed">Authors</span>
        </RouterLink>
      </li>
      <li class="w-full">
        <RouterLink
          :to="{ name: 'series' }"
          class="sidebar-link flex items-center gap-2"
          active-class="sidebar-link-active">
          <svg
            class="inline size-6"
            fill="none">
            <use xlink:href="/icons/iconSprite.svg#series" />
          </svg>
          <span v-show="!collapsed">Series</span>
        </RouterLink>
      </li>
      <li class="w-full">
        <RouterLink
          :to="{ name: 'media' }"
          class="sidebar-link flex items-center gap-2"
          active-class="sidebar-link-active">
          <svg
            class="inline size-6"
            fill="none">
            <use xlink:href="/icons/iconSprite.svg#photoLibrary" />
          </svg>
          <span v-show="!collapsed">Media</span>
        </RouterLink>
      </li>
      <hr class="my-1">
      <li
        v-if="route.name === 'books'"
        class="w-full">
        <RouterLink
          :to="{ name: 'book-create' }"
          class="sidebar-link flex items-center gap-2"
          active-class="sidebar-link-active">
          <svg
            class="inline size-6"
            fill="none">
            <use xlink:href="/icons/iconSprite.svg#bookAdd" />
          </svg>
          <span v-show="!collapsed">Create</span>
        </RouterLink>
      </li>
      <li
        v-if="route.name === 'book-update'"
        class="w-full">
        <RouterLink
          :to="{ name: 'book-view' }"
          class="sidebar-link flex items-center gap-2"
          active-class="sidebar-link-active">
          <svg
            class="inline size-6"
            fill="none">
            <use xlink:href="/icons/iconSprite.svg#openBook" />
          </svg>
          <span v-show="!collapsed">View</span>
        </RouterLink>
      </li>
      <li
        v-if="['book-view', 'comics-view'].includes(routeName)"
        class="w-full">
        <RouterLink
          :to="{ name: 'book-update', params: { id: bookID } }"
          class="sidebar-link flex items-center gap-2"
          active-class="sidebar-link-active">
          <svg
            class="inline size-6"
            fill="none">
            <use xlink:href="/icons/iconSprite.svg#openBook" />
          </svg>
          <span v-show="!collapsed">Update</span>
        </RouterLink>
      </li>
      <!-- 			<li class="px-4">
				<ThemeSwitcher />
			</li> -->
    </ul>
    <div
      id="menu-target"
      class="mt-4 flex flex-wrap items-center gap-3 px-2" />
  </aside>
</template>
