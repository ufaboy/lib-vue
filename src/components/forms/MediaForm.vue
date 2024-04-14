<script setup lang="ts">
import { useMedia } from '@/composables/media';
import { Media } from '@/interfaces/media';

const { mediaFileName, updateMedia, getStorageMediaUrl } = useMedia();

const props = defineProps<{
	media: Media;
}>();
const emit = defineEmits(['close']);

function reset() {
	mediaFileName.value = props.media.file_name;
}

reset();
</script>

<template>
  <form
    id="Media"
    method="dialog"
    name="Media"
    class="flex flex-row flex-wrap"
    @submit.prevent="updateMedia">
    <header class="mb-4 flex w-full flex-row items-center justify-between">
      <h2 class="filter-title">
        {{ props.media.file_name }}
      </h2>
      <button
        class="close-btn hover:animate-spin"
        type="reset"
        @click.passive="$emit('close')">
        <svg class="size-6"><use xlink:href="/icons/iconSprite.svg#close" /></svg>
      </button>
    </header>
    <img
      :src="getStorageMediaUrl(props.media.file_name, props.media.book_id)"
      alt=""
      class="mx-auto mb-4 max-h-96 max-w-xs rounded-md">
    <label class="w-full mb-4">
      <span>File name</span>
      <input
        v-model="mediaFileName"
        type="text"
        name="file_name"
        class="mt-1 w-full rounded-md p-2 dark:bg-slate-700">
    </label>
    <footer class="flex w-full flex-row items-center justify-between">
      <button
        type="reset"
        class="btn-gray-outline"
        @click.passive.prevent="reset">
        Reset
      </button>
      <button
        class="btn-green"
        value="default">
        Save
      </button>
    </footer>
  </form>
</template>