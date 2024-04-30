<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBook } from '@/composables/book';
import { useTag } from '@/composables/tags';
import { useSwipe } from '@/composables/swipe';
import { BookTableIem } from '@/interfaces/book';

import BookFilterForm from '@/components/forms/BookFilterForm.vue';

document.title = 'Books';

const { books, queryBooks, infinityState, loading, getBooks, isComics } = useBook();
const { slideLeftRight, touchStart, touchEnd } = useSwipe();
const { tags, getTags } = useTag();

queryBooks.value.perPage = 25;

const filterDialog = ref<InstanceType<typeof HTMLDialogElement>>();

function closeDialog() {
	slideLeftRight.value = false;
	filterDialog.value?.close();
}

function getBooksByFilter() {
	closeDialog();
	books.value = [];
	infinityState.value = true;
	queryBooks.value.page = 1;
	getBooks('push');
}

function getCoverUrl(book: BookTableIem) {
	return book.cover || '/images/book_x100.png';
}

watch(slideLeftRight, (newValue) => {
	if (newValue) {
		filterDialog.value?.showModal();
	}
});

getTags();
</script>

<template>
  <main class="flex flex-row flex-wrap px-2 md:px-0" @touchstart="touchStart" @touchend="touchEnd">
    <router-link
      v-for="book of books"
      :key="'book' + book.id"
      :to="{ name: isComics(book) ? 'comics-view' : 'book-view', params: { id: book.id } }"
      class="mb-2 flex h-fit w-full cursor-pointer flex-row flex-nowrap rounded-md p-2 shadow-lg drop-shadow-md hover:bg-sky-400 dark:bg-slate-800 hover:dark:bg-slate-700 sm:mb-1 sm:mr-1 sm:flex-1 sm:shrink-0 md:min-w-72">
      <img
        :src="getCoverUrl(book)"
        alt="cover"
        class="mr-2 size-[100px] shrink-0 rounded-md object-cover"
        width="100"
        height="100"
        onerror="this.onerror=null;this.src = '/images/book_x100.png'">
      <div class="w-[calc(100%_-_108px)]">
        <div class="truncate font-bold">
          {{ book.name }}
        </div>
        <div class="line-clamp-2 break-all">
          {{ book.description }}
        </div>
      </div>
    </router-link>
    <observer v-if="infinityState || loading" :options="{ threshold: 0.5 }" @intersect="getBooks('push')" />
    <div v-else-if="!books || !books.length" class="flex h-[calc(100dvh_-_50px)] w-full items-center justify-center text-xl">
      Nothing found
    </div>
    <dialog
      ref="filterDialog"
      class="dialog w-80 rounded-lg bg-neutral-300 text-slate-800 shadow-md dark:bg-slate-800 dark:text-white">
      <BookFilterForm
        v-if="tags"
        v-model:filter="queryBooks"
        :tags="tags"
        @search="getBooksByFilter"
        @close="closeDialog" />
    </dialog>
  </main>
</template>
