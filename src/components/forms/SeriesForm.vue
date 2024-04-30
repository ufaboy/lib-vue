<script setup lang="ts">
import { ref } from 'vue';
import type { Series } from '@/interfaces/series';

const props = defineProps<{
	series?: Partial<Series>;
}>();
const emit = defineEmits<{
	(e: 'update:series', series: Partial<Series>): void;
	(e: 'close'): void;
}>();

const id = ref<number>();
const url = ref<string>('');
const name = ref<string>('');

if (props.series) {
    id.value = props.series.id;
    url.value = props.series.url || '';
    name.value = props.series.name || '';
  }
</script>

<template>
  <form method="dialog" class="flex flex-row flex-wrap p-4" @submit.prevent="emit('update:series', {name, url, id})">
    <header class="mb-4 flex w-full flex-row items-center justify-between">
      <h2 class="filter-title">
        {{ props.series && props.series.id ? 'Update' : 'Create' }}
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