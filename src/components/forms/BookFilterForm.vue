<script setup lang="ts">
import { computed } from 'vue';
import { RATINGS, SORTING_OPTIONS } from '@/utils/constants';
import { QueryBooks } from '@/interfaces/book';
import { Tag } from '@/interfaces/tag';

const emit = defineEmits<{
	(e: 'update:filter', filter: QueryBooks): void;
	(e: 'search'): void;
	(e: 'close'): void;
}>();
const props = defineProps<{
	filter: QueryBooks;
	tags: Array<Tag>;
}>();

const queryBooks = computed({
	get() {
		return props.filter;
	},
	set(newValue) {
		emit('update:filter', newValue);
	},
});

const ascending = computed({
	get() {
		return queryBooks.value.sort[0] !== '-';
	},
	set(newValue) {
		if (newValue) {
			queryBooks.value.sort = queryBooks.value.sort[0] === '-' ? queryBooks.value.sort.slice(1) : queryBooks.value.sort;
		} else {
			queryBooks.value.sort = `-${queryBooks.value.sort}`;
		}
	},
});

function updateSort(event: Event) {
	const target = event.target as HTMLSelectElement;
	queryBooks.value.sort = ascending.value ? target.value : `-${target.value}`;
}
</script>

<template>
  <form method="dialog" class="flex flex-row flex-wrap p-4" @submit="$emit('search')">
    <header class="mb-4 flex w-full flex-row items-center justify-between">
      <h2 class="filter-title">
        Filter & Sort
      </h2>
      <button class="close-btn" type="reset" @click.passive="$emit('close')">
        <svg class="size-6"><use xlink:href="/icons/iconSprite.svg#close" /></svg>
      </button>
    </header>
    <label for="name" class="mb-3 w-full">
      <span>Name</span>
      <input
        v-model="queryBooks.name"
        type="search"
        name="name"
        class="mt-1 w-full rounded-md p-2 dark:bg-slate-700">
    </label>
    <label for="tag" class="mb-3 w-full">
      <span>Tag</span>
      <select v-model="queryBooks.tag" name="tag" class="mt-1 h-10 w-full rounded-md p-2 dark:bg-slate-700">
        <option class="flex w-full p-1" :value="undefined">
          All
        </option>
        <option v-for="tag of tags" :key="tag.id" :value="tag.name">
          {{ tag.name }}
        </option>
      </select>
    </label>
    <label for="rating" class="mb-3 w-full">
      <span>Rating</span>
      <select
        v-model="queryBooks.rating"
        name="rating"
        class="mt-1 h-10 w-full rounded-md p-2 dark:bg-slate-700">
        <option
          class="flex w-full p-1"
          :value="undefined">All</option>
        <option
          v-for="item in RATINGS"
          :key="item.name"
          class="value"
          :value="item.value">{{ item.name }}</option>
      </select>
    </label>
    <label
      for="sort"
      class="mb-1 w-full">
      <span>Sort by</span>
    </label>
    <select
      name="sort"
      :value="queryBooks.sort.replace('-', '')"
      class="mb-3 h-10 w-1/2 rounded-md p-2 capitalize dark:bg-slate-700"
      @input="updateSort">
      <option
        v-for="(sortOption, index) in SORTING_OPTIONS"
        :key="index"
        class="capitalize"
        :value="sortOption">
        {{ sortOption }}
      </option>
    </select>
    <label class="btn-blue-outline mx-auto mb-3 h-10 w-20">
      <span class="">{{ queryBooks.sort[0] !== '-' ? 'ASC' : 'DESC' }}</span>
      <input
        v-model="ascending"
        type="checkbox"
        name="ascending"
        class="size-0 opacity-0">
    </label>
    <footer class="flex w-full flex-row items-center justify-between">
      <button
        type="reset"
        class="btn-gray-outline">
        Reset
      </button>
      <button
        class="btn-green"
        value="default">
        Find
      </button>
    </footer>
  </form>
</template>
