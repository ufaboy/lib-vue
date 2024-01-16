<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import { useImage } from '@/composables/images';

import ImageForm from '@/components/forms/ImageForm.vue'

const route = useRoute()
const { queryImages, image, images, imageDialog, infinityState,
  getUploadedImageUrl, showImageDialog, closeDialog, getImagesAndPush } = useImage()

const mounted = ref(false)

function changeQuery() {
  queryImages.value.page = 1
  images.value = []
}

function parseQueryParams() {
  const bookID = route.query['book-id']
  if(bookID) queryImages.value.book_id = Number(bookID)
}
watch(() => route.query, () => {
  console.log('route.query', route.query)
})

onMounted(() => {
  mounted.value = true
})
queryImages.value.page = 1
queryImages.value.perPage = 20
parseQueryParams()
</script>

<template>
  <main class="flex flex-wrap gap-3">
    <form
      action=""
      class="flex w-full items-center gap-4"
    >
      <label
        for=""
        class="flex flex-col"
      >
        <span>Book ID</span>
        <input
          v-model="queryImages.book_id"
          type="search"
          class="input"
          @search="changeQuery"
        >
      </label>
      <label
        for=""
        class="flex flex-col"
      >
        <span>Book Name</span>
        <input
          v-model="queryImages.bookName"
          type="search"
          class="input"
          @search="changeQuery"
        >
      </label>
      <label
        for=""
        class="flex flex-col"
      >
        <span>File Name</span>
        <input
          v-model="queryImages.file_name"
          type="search"
          class="input"
          @search="changeQuery"
        >
      </label>
    </form>
    <button
      v-for="img in images"
      :key="img.id"
      @click="showImageDialog(img)"
    >
      <figure class="h-full">
        <img
          :src="getUploadedImageUrl(img)"
          alt=""
          class="size-44 rounded-md object-cover"
        >
        <figcaption class="mt-auto">
          {{ img.file_name }}
        </figcaption>
      </figure>
    </button>
    <observer
      v-if="infinityState"
      @intersect="getImagesAndPush(queryImages)"
    />
    <dialog
      ref="imageDialog"
      class="dialog max-w-sm rounded-lg bg-neutral-300 p-4 text-slate-800 shadow-md dark:bg-slate-800 dark:text-white"
      @close="closeDialog"
    >
      <ImageForm
        v-if="image"
        :image="image"
        @close="closeDialog"
      />
    </dialog>
  </main>
</template>