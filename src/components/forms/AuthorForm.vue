<script setup lang="ts">
import { ref } from 'vue';
import type { Author } from '@/interfaces/author';

const props = defineProps<{
	author: Author;
}>();
const emit = defineEmits<{
	(e: 'update:author', author: Author): void;
	(e: 'close'): void;
}>();

const authorURL = ref(props.author.url);
const authorName = ref(props.author.name);
</script>

<template>
  <form
    action=""
    method="dialog"
    class="flex flex-row flex-wrap p-4"
    @submit.prevent="emit('update:author', {name: authorName, url: authorURL})">
    <header class="mb-4 flex w-full flex-row items-center justify-between">
      <h2 class="filter-title">
        {{ props.author && props.author.id ? 'Update' : 'Create' }}
      </h2>
    </header>
    <label
      v-if="props.author"
      for="name"
      class="label mb-3 w-full">
      <span>Name</span>
      <input
        v-model="authorName"
        type="text"
        name="name"
        class="input mt-1 w-full">
    </label>
    <label
      v-if="props.author"
      for="url"
      class="label mb-3 w-full">
      <span>URL</span>
      <input
        v-model="authorURL"
        type="url"
        name="url"
        class="input mt-1 w-full">
    </label>
    <footer class="flex w-full flex-row items-center justify-between">
      <button
        type="reset"
        class="btn-gray-outline"
        aria-label="close"
        formnovalidate
        @click="emit('close')">
        Close
      </button>
      <button
        class="btn-green"
        value="default">
        Save
      </button>
    </footer>
  </form>
</template>