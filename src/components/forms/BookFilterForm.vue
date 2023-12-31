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
	queryBooks.value.sort = ascending ? target.value : `-${target.value}`;
}
</script>

<template>
	<form method="dialog" class="flex flex-row flex-wrap p-4" @submit="$emit('search')">
		<header class="w-full flex flex-row justify-between items-center mb-4">
			<h2 class="filter-title">Filter & Sort</h2>
			<button class="close-btn" type="reset" @click="$emit('close')">
				<svg class="size-6"><use xlink:href="/icons/iconSprite.svg#close" /></svg>
			</button>
		</header>
		<label for="name" class="w-full mb-3">
			<span>Name</span>
			<input type="search" name="name" class="w-full mt-1 p-2 rounded-md dark:bg-slate-700" v-model="queryBooks.name" />
		</label>
		<label for="tag" class="w-full mb-3">
			<span>Tag</span>
			<select name="tag" class="w-full h-10 mt-1 p-2 rounded-md dark:bg-slate-700" v-model="queryBooks.tag">
				<option class="flex w-full p-1" :value="undefined">All</option>
				<option v-for="tag of tags" :value="tag.name" :key="tag.id">{{ tag.name }}</option>
			</select>
		</label>
		<label for="rating" class="w-full mb-3">
			<span>Rating</span>
			<select name="rating" class="w-full h-10 mt-1 p-2 rounded-md dark:bg-slate-700" v-model="queryBooks.rating">
				<option class="value" v-for="item in RATINGS" :value="item.value" :key="item.name">{{ item.name }}</option>
			</select>
		</label>
		<label for="sort" class="w-full mb-1">
			<span>Sort by</span>
		</label>
		<select
			name="sort"
			@input="updateSort"
			:value="queryBooks.sort.replace('-', '')"
			class="w-1/2 h-10 mb-3 p-2 rounded-md dark:bg-slate-700 capitalize">
			<option class="capitalize" :value="sortOption" v-for="(sortOption, index) in SORTING_OPTIONS" :key="index">
				{{ sortOption }}
			</option>
		</select>
		<label class="w-20 h-10 mb-3 mx-auto btn-blue-outline">
			<span class="">{{ queryBooks.sort[0] !== '-' ? 'ASC' : 'DESC' }}</span>
			<input type="checkbox" name="ascending" class="w-0 h-0 opacity-0" v-model="ascending" />
		</label>
		<footer class="w-full flex flex-row justify-between items-center">
			<button type="reset" class="btn-gray-outline">Reset</button>
			<button class="btn-green" value="default">Find</button>
		</footer>
	</form>
</template>
