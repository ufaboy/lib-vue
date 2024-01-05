<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBook } from '@/composables/book';
import { useTag } from '@/composables/tags';
import { useSwipe } from '@/composables/swipe';
import { Book } from '@/interfaces/book';

import BookFilterForm from '@/components/forms/BookFilterForm.vue';

document.title = 'Books';

const { books, queryBooks, infinityState, loading, getBooks, isComics } = useBook();
const { slideLeftRight, touchStart, touchEnd } = useSwipe();
const { tags, getTags } = useTag();

queryBooks.value.perPage = 25;

const filterDialog = ref<InstanceType<typeof HTMLDialogElement>>();
const filterDialogShow = ref(false);

function closeDialog() {
	slideLeftRight.value = false;
	filterDialogShow.value = false;
	if (filterDialog.value) filterDialog.value.close();
}

function getBooksByFilter() {
	books.value = [];
	infinityState.value = true;
	queryBooks.value.page = 1;
	getBooks('push');
}

function getCoverUrl(book: Book) {
	return book.cover || '/images/book_x100.png';
}

watch(slideLeftRight, (newValue) => {
	if (newValue) {
		filterDialogShow.value = newValue;
		filterDialog.value?.showModal();
	}
});

getTags();
</script>

<template>
	<main class="flex flex-row flex-wrap px-2 md:px-0" @touchstart="touchStart" @touchend="touchEnd">
		<router-link
			:to="{ name: isComics(book) ? 'comics-view' : 'book-view', params: { id: book.id } }"
			replace
			class="h-fit w-full md:min-w-[18rem] flex sm:flex-1 sm:shrink-0 flex-row flex-nowrap drop-shadow-md cursor-pointer rounded-md p-2 sm:mr-1 sm:mb-1 hover:bg-sky-400 shadow-lg mb-2 dark:bg-slate-800 hover:dark:bg-slate-700"
			v-for="book of books"
			:key="'book' + book.id">
			<img
				:src="getCoverUrl(book)"
				alt="cover"
				class="shrink-0 rounded-md mr-2 object-cover w-[100px] h-[100px]"
				width="100"
				height="100"
				onerror="this.onerror=null;this.src = '/images/book_x100.png'" />
			<div class="w-[calc(100%_-_108px)]">
				<div class="font-bold truncate">{{ book.name }}</div>
				<div class="line-clamp-2 break-all">{{ book.description }}</div>
			</div>
		</router-link>
		<observer v-if="infinityState || loading" :options="{ threshold: 0.5 }" @intersect="getBooks('push')" />
		<div v-else-if="!books || !books.length"
			class="w-full text-xl flex items-center justify-center h-[calc(100dvh_-_50px)]">
			Nothing found
		</div>
		<dialog
			ref="filterDialog"
			class="dialog bg-neutral-300 dark:bg-slate-800 text-slate-800 dark:text-white shadow-md rounded-lg w-80"
			@close.passive="closeDialog">
			<BookFilterForm
				v-if="tags"
				:tags="tags"
				@search="getBooksByFilter"
				@close.passive="closeDialog"
				v-model:filter="queryBooks" />
		</dialog>
	</main>
</template>
