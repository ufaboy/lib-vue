<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useImage } from '@/composables/images';

import ImageForm from '@/components/forms/ImageForm.vue';

const route = useRoute();
const {
	queryImages,
	image,
	images,
	imageDialog,
	storageImages,
	getStorageImageUrl,
	getUploadedImageUrl,
	showImageDialog,
	closeDialog,
	getTotal,
} = useImage();

const mounted = ref(false);

const filteredImages = computed(() => {
	if (queryImages.value.book_id) {
		return storageImages.value.filter((book) => {
			return book.bookID === Number(queryImages.value.book_id);
		});
	} else return storageImages.value;
});

function changeQuery() {
	queryImages.value.page = 1;
	images.value = [];
}

function parseQueryParams() {
	const bookID = route.query['book-id'];
	if (bookID) queryImages.value.book_id = Number(bookID);
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
	<main class="flex flex-wrap gap-3">
		<form action="" class="flex w-full items-center gap-4">
			<label for="" class="flex flex-col">
				<span>Book ID</span>
				<input v-model="queryImages.book_id" type="search" class="input" list="idList" />
        <datalist id="idList">
          <option v-for="(book, index) in storageImages" :key="index">
          {{ book.bookID }}</option>
        </datalist>
			</label>
			<!-- <label for="" class="flex flex-col">
				<span>Book Name</span>
				<input v-model="queryImages.bookName" type="search" class="input" @search="changeQuery" />
			</label>
			<label for="" class="flex flex-col">
				<span>File Name</span>
				<input v-model="queryImages.file_name" type="search" class="input" @search="changeQuery" />
			</label> -->
		</form>
		<div v-for="dir in filteredImages" :key="dir.bookID">
			<h2 class="mb-2">Book {{ dir.bookID }} {{ dir.bookName }}</h2>
			<button v-for="(img, index) in dir.images" :key="index" class="p-2" @click="showImageDialog(dir.bookID, img)">
				<figure class="h-full" v-lazy-load>
					<img src="" class="size-44 rounded-md object-cover" :data-url="getStorageImageUrl(img, dir.bookID)" />
					<figcaption class="mt-auto">
						{{ img }}
					</figcaption>
				</figure>
			</button>
		</div>
		<dialog
			ref="imageDialog"
			class="dialog max-w-sm rounded-lg bg-neutral-300 p-4 text-slate-800 shadow-md dark:bg-slate-800 dark:text-white"
			@close="closeDialog">
			<ImageForm v-if="image" :image="image" @close="closeDialog" />
		</dialog>
	</main>
</template>
