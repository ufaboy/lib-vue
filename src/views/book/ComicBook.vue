<template>
  <div class="book-container">
    <div class="book-video flex flex-col lg:flex-row p-3" v-if="getTypeBook === 'video' || getTypeBook === 'audio'">
      <ol class="w-96 mr-3" v-if="!isMobile()">
        <li class="w-full bg-sky-100 hover:bg-sky-300 border shadow mb-2 "
            :class="{'!bg-sky-500 text-white': media.id === activeMedia.id}"
            v-for="media of book?.files"
            :key="media.id"
            @click="activeMedia = media">
          <button class="p-2 text-left w-full truncate">{{ media.file_name }}</button>
        </li>
      </ol>
      <select class="select w-full mb-3" v-else-if="isMobile()" v-model="activeMedia">
        <option :value="media" v-for="media of book.files" :key="media.id">{{ media.file_name }}</option>
      </select>
      <figure class="">
        <video class="video w-full" :src="getSrcUrl" controls v-if="activeMedia.type.includes('video/')"></video>
        <audio class="audio" :src="getSrcUrl" controls v-else-if="activeMedia.type.includes('audio/')"></audio>
      </figure>
    </div>
    <div class="flex flex-row flex-wrap" v-else-if="getTypeBook === 'picture'">
      <ImageItem class="object-cover w-full min-h-[300px]" :source="getSrcImgUrl(media)" v-for="media of book.files" :key="media.id"
                  @click="activeImage = getSrcImgUrl(media)"></ImageItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import useBook from "../../composables/useBook";
import {isMobile} from "../../utils/helpers";
import ImageItem from "@/components/ImageItem.vue";
import {Category} from "../../interfaces/category";
import {Genre} from "../../interfaces/genre";
import {BookFile, Book} from "../../interfaces/book";

import {API_URL} from "../../../runtimeEnv";
import { BookDirFile } from "../../interfaces/book";

const route = useRoute();
const {book, downloadBook} = useBook();
const activeImage = ref('');
const activeMedia = ref({id: 0, type: '', url: ''});
const getTypeBook = computed(() => {
  if (book.value.genres.findIndex(item => item.name === 'picture') !== -1) {
    return 'picture'
  } else if (book.value.genres.findIndex(item => item.name === 'audio') !== -1) {
    return 'audio'
  } else if (book.value.genres.findIndex(item => item.name === 'video') !== -1) {
    return 'video'
  } else return ''
})
const getSrcUrl = computed(() => {
  return activeMedia.value.url ? `${API_URL}/${activeMedia.value.url}` : ''
})

function getSrcImgUrl(e:BookDirFile) {
  return e.url ? `${API_URL}/${e.url}` : ''
}
downloadBook(+route.params.id)
</script>

<style lang="scss">
</style>