<script setup lang="ts">
import { ref } from 'vue';
import type { Author } from '@/interfaces/author';

const props = defineProps<{
  author?: Partial<Author>;
}>();
const emit = defineEmits<{
  (e: 'update:author', author: Partial<Author>): void;
  (e: 'close'): void;
}>();

const id = ref<number>()
const url = ref<string>();
const name = ref<string>();

if(props.author) {
  id.value = props.author.id;
  url.value = props.author.url || '';
  name.value = props.author.name || '';
}
</script>

<template>
  <form method="dialog" class="flex flex-row flex-wrap p-4" @submit.prevent="emit('update:author', { id, name, url })">
    <header class="mb-4 flex w-full flex-row items-center justify-between">
      <h2 class="filter-title">
        {{ props.author && props.author.id ? 'Update' : 'Create' }}
      </h2>
    </header>
    <label for="name" class="label mb-3 w-full">
      <span>Name</span>
      <input
        v-model="name"
        type="text"
        name="name"
        class="input mt-1 w-full">
    </label>
    <label for="url" class="label mb-3 w-full">
      <span>URL</span>
      <input
        v-model="url"
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
      <button class="btn-green" value="default">
        Save
      </button>
    </footer>
  </form>
</template>