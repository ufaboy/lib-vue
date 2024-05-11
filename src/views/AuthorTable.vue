<!-- eslint-disable vue/html-indent -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthor } from '@/composables/author';

import AuthorForm from '@/components/forms/AuthorForm.vue';
import TablePaginator from '@/components/TablePaginator.vue';
import SkeletonTableRow from '@/components/SkeletonTableRow.vue';

document.title = 'Authors';

const props = defineProps({
  sidebarCollapsed: Boolean,
});

const {
  authorDialog,
  author,
  authors,
  authorsMeta,
  queryAuthors,
  getAuthors,
  updateAuthor,
  changeSort,
  openAuthorDialog,
  closeDialog,
  parseQueryAuthorParams,
} = useAuthor();
queryAuthors.value.perPage = 20;
const mounted = ref(false);

function getAuthorsByPage(page: number) {
  queryAuthors.value.page = page;
  getAuthors();
}

function startCreateAuthor() {
  author.value = { name: '', url: '' };
  authorDialog.value?.showModal();
}

function updateLimit(size: number) {
  queryAuthors.value.perPage = size;
  getAuthors();
}

onMounted(() => {
  mounted.value = true;
});

parseQueryAuthorParams();
getAuthors();
</script>

<template>
  <main class="">
    <table v-table-nav class="w-full table-auto">
      <thead>
        <tr>
          <th class="th sticky top-0">
            <button
              class="flex flex-row flex-nowrap items-center"
              :class="{ 'text-emerald-300': queryAuthors.sort.includes('id') }"
              @click.passive="changeSort('id')">
              <span class="mr-1">ID</span>
              <svg class="size-4">
                <use v-if="queryAuthors.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
                <use v-else xlink:href="/icons/iconSprite.svg#ascending" />
              </svg>
            </button>
          </th>
          <th class="th sticky top-0">
            <button
              class="flex flex-row flex-nowrap items-center"
              :class="{ 'text-emerald-300': queryAuthors.sort.includes('name') }"
              @click.passive="changeSort('name')">
              <span class="mr-1">Name</span>
              <svg class="size-4">
                <use v-if="queryAuthors.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
                <use v-else xlink:href="/icons/iconSprite.svg#ascending" />
              </svg>
            </button>
          </th>
          <th class="th sticky top-0">
            <button
              class="flex flex-row flex-nowrap items-center"
              :class="{ 'text-emerald-300': queryAuthors.sort.includes('url') }"
              @click.passive="changeSort('url')">
              <span class="mr-1">URL</span>
              <svg class="size-4">
                <use v-if="queryAuthors.sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
                <use v-else xlink:href="/icons/iconSprite.svg#ascending" />
              </svg>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="authorItem in authors"
          :key="authorItem.id"
          class="tr"
          @click.passive="openAuthorDialog(authorItem)">
          <td class="td">
            <div>{{ authorItem.id }}</div>
          </td>
          <td class="td">
            <div>{{ authorItem.name }}</div>
          </td>
          <td class="td">
            <div class="w-32 truncate md:w-auto">
              {{ authorItem.url }}
            </div>
          </td>
        </tr>
        <SkeletonTableRow v-if="!authors?.length" count="3" />
      </tbody>
    </table>
    <TablePaginator
      v-if="authorsMeta && authorsMeta.pageCount > 1"
      :meta="authorsMeta"
      @update-page="getAuthorsByPage"
      @update-limit="updateLimit" />
    <Teleport v-if="mounted" to="#menu-target">
      <button
        class="nav-btn flex items-center border px-2 py-1 text-white hover:bg-blue-500 dark:hover:bg-gray-600"
        :class="{ 'w-full': !sidebarCollapsed, 'w-fit': sidebarCollapsed }"
        @click.passive="startCreateAuthor">
        <svg
          aria-hidden="true"
          role="status"
          class="inline size-6"
          fill="none">
          <use xlink:href="/icons/iconSprite.svg#add" />
        </svg>
        <span v-if="!sidebarCollapsed">Create Author</span>
      </button>
    </Teleport>
    <dialog
      ref="authorDialog"
      class="dialog w-80 rounded-lg bg-neutral-300 text-slate-800 shadow-md dark:bg-slate-800 dark:text-white"
      @close="closeDialog">
      <AuthorForm
        v-if="author"
        :author="author"
        @close="closeDialog"
        @update:author="updateAuthor" />
    </dialog>
  </main>
</template>
