<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useTag } from '@/composables/tags';
import { Tag } from '@/interfaces/tag';

import TagForm from '@/components/forms/TagForm.vue';

document.title = 'Tags';

const { tag, tags, tagDialog, getTags, updateTag, closeTagDialog } = useTag();
const mounted = ref(false);
const sort = ref('name');

const sortedTagList = computed(() => {
  if (tags.value) {
    const sortName = sort.value.replace('-', '');
    const sorted = tags.value.toSorted((a: Tag, b: Tag) => (sortName === 'id' ? a.id - b.id : Number(a.name > b.name)));
    return sort.value[0] !== '-' ? sorted : sorted.reverse();
  }
  return [];
});

function showTagModal(data?: Tag) {
  if (data) {
    tag.value = { ...data };
  }

  tagDialog.value?.showModal();
}

function changeSort(field: string) {
  const desc = sort.value[0] === '-';
  sort.value = `${desc ? '' : '-'}${field}`;
}

onMounted(() => {
  mounted.value = true;
});

if (!tags.value) getTags({ perPage: 50, sort: 'name' });
</script>

<template>
  <main class="">
    <table v-if="tags" v-table-nav class="w-full table-auto">
      <thead>
        <tr>
          <th class="th">
            <button
              class="flex flex-row flex-nowrap items-center"
              :class="{ 'text-emerald-300': sort.includes('id') }"
              @click="changeSort('id')">
              <span class="mr-1">ID</span>
              <svg class="size-4">
                <use v-if="sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
                <use v-else xlink:href="/icons/iconSprite.svg#ascending" />
              </svg>
            </button>
          </th>
          <th class="th">
            <button
              class="flex flex-row flex-nowrap items-center"
              :class="{ 'text-emerald-300': sort.includes('name') }"
              @click="changeSort('name')">
              <span class="mr-1">Name</span>
              <svg class="size-4">
                <use v-if="sort[0] === '-'" xlink:href="/icons/iconSprite.svg#descending" />
                <use v-else xlink:href="/icons/iconSprite.svg#ascending" />
              </svg>
            </button>
          </th>
        </tr>
      </thead>
      <TransitionGroup tag="tbody" name="list">
        <tr
          v-for="sortedTag in sortedTagList"
          :key="sortedTag.id"
          class="cursor-pointer border-b border-slate-600 hover:bg-gray-300 dark:hover:bg-gray-700"
          @click="showTagModal(sortedTag)">
          <td class="td">
            <span>{{ sortedTag.id }}</span>
          </td>
          <td class="td">
            <span>{{ sortedTag.name }}</span>
          </td>
        </tr>
      </TransitionGroup>
    </table>
    <dialog
      ref="tagDialog"
      class="dialog w-80 rounded-lg bg-neutral-300 text-slate-800 shadow-md dark:bg-slate-800 dark:text-white"
      @close="closeTagDialog">
      <TagForm
        v-if="tag"
        :tag="tag"
        @close="closeTagDialog"
        @update="updateTag" />
    </dialog>
  </main>
</template>
