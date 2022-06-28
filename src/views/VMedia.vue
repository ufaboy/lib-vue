<template>
  <div class="media-manager min-h-[calc(100%_-_80px)] lg:min-h-fit flex flex-row px-3">
    <ol class="mr-4">
      <li class="w-24 cursor-pointer" v-for="(dir, index) of directories" @click="activeDirIndex = index">
        {{ dir.dir_name }}
      </li>
    </ol>
    <div class="preview-wrapper w-80 flex flex-row flex-wrap shrink-0 scrollbar max-h-full">
      <figure class="figure group w-36 mr-3 mb-3 cursor-pointer" v-for="(file, index) of activeDir" :key="'file-' + index" @click="openMedia(file)">
        <img class="w-36 h-[120px] object-cover rounded-md cursor-pointer hover:scale-110" :src="calcUrl(file)" alt="">
        <figcaption class="truncate text-nowrap dark:text-blue-300 dark:group-hover:text-white">{{ file.full_name }}</figcaption>
        <div class="btn-bar flex flex-row flex-nowrap justify-between" v-if="!file.id">
          <button class="btn-green !p-1 cursor-pointer" @click.stop="attachFile(file.full_name, index)">
            Attach
          </button>
          <button class="btn-red !p-1 cursor-pointer"
                  @click.stop="deleteFileFromStorage(file.full_name, index)">Delete
          </button>
        </div>
      </figure>
    </div>
    <div class="media-wrapper scrollbar ml-3">
      <img class="media-full" :src="activeMedia.url" alt="" v-if="activeMedia.type === 'image'">
      <video class="media-full" v-else-if="activeMedia.type === 'video'" controls>
        <source :src="activeMedia.url">
      </video>
      <audio class="max-w-[700px] max-h-[600px]" v-else-if="activeMedia.type === 'audio'" controls>
        <source :src="activeMedia.url">
      </audio>
      <span>{{ activeMedia.full_name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import useMedia from "../composables/useMedia";

const props = defineProps({
  categories: Array,
})
const {
  directories,
  activeDirIndex,
  activeMedia,
  activeDir,
  calcUrl,
  openMedia,
  getMediaFiles,
  attachFile,
  deleteFileFromStorage
} = useMedia()
getMediaFiles()
</script>

<style lang="scss">
</style>