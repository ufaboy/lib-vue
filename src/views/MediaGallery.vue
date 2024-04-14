<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMedia } from '@/composables/media';

import MediaForm from '@/components/forms/MediaForm.vue';

const route = useRoute();
const {
	queryMedia,
	media,
	mediaList,
	mediaDialog,
	storageMedia,
	getStorageMediaUrl,
	showMediaDialog,
	closeDialog,
	getTotal,
} = useMedia();

const mounted = ref(false);

const filteredMediaList = computed(() => {
	if (queryMedia.value.book_id) {
		return storageMedia.value.filter((book) => {
			return book.bookID === Number(queryMedia.value.book_id);
		});
	} else return storageMedia.value;
});

function changeQuery() {
	queryMedia.value.page = 1;
	mediaList.value = [];
}

function parseQueryParams() {
	const bookID = route.query['book-id'];
	if (bookID) queryMedia.value.book_id = Number(bookID);
}

watch(
	() => route.query,
	() => {
		console.log('route.query', route.query);
	},
);

onMounted(() => {
	mounted.value = true;
});
getTotal();
</script>

<template>
  <main class="flex flex-wrap gap-3 px-2">
    <form
      action=""
      class="flex w-full items-center gap-4">
      <label
        for=""
        class="flex flex-col">
        <span>Book ID</span>
        <input
          v-model="queryMedia.book_id"
          type="search"
          class="input"
          list="idList">
        <datalist id="idList">
          <option
            v-for="(book, index) in storageMedia"
            :key="index">
            {{ book.bookID }}
          </option>
        </datalist>
      </label>
      <!-- <label for="" class="flex flex-col">
				<span>Book Name</span>
				<input v-model="queryMedia.bookName" type="search" class="input" @search="changeQuery" />
			</label>
			<label for="" class="flex flex-col">
				<span>File Name</span>
				<input v-model="queryMedia.file_name" type="search" class="input" @search="changeQuery" />
			</label> -->
    </form>
    <div
      v-for="dir in filteredMediaList"
      :key="dir.bookID">
      <RouterLink
        :to="{name: 'book-view', params: {id:dir.bookID}}"
        class="mb-2 flex">
        Book: {{ dir.bookID }} {{ dir.bookName }}
      </RouterLink>
      <button
        v-for="(img, index) in dir.mediaList"
        :key="index"
        class="p-2"
        @click="showMediaDialog(dir.bookID, img)">
        <video
          v-if="img.includes('.mp4')"
          loop
          autoplay
          muted
          :src="getStorageMediaUrl(img, dir.bookID)"
          class="size-44" />
        <figure
          v-else
          v-lazy-load
          class="h-full">
          <img
            src=""
            class="size-44 rounded-md object-cover"
            :data-url="getStorageMediaUrl(img, dir.bookID)">
          <figcaption class="mt-auto">
            {{ img }}
          </figcaption>
        </figure>
      </button>
    </div>
    <dialog
      ref="mediaDialog"
      class="dialog max-w-sm rounded-lg bg-neutral-300 p-4 text-slate-800 shadow-md dark:bg-slate-800 dark:text-white"
      @close="closeDialog">
      <MediaForm
        v-if="media"
        :media="media"
        @close="closeDialog" />
    </dialog>
  </main>
</template>