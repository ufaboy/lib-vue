<script setup lang="ts">
import { ref } from 'vue';
import type { Series } from '@/interfaces/series';

const props = defineProps<{
	series: Series;
}>();
const emit = defineEmits<{
	(e: 'update:series', series: Series): void;
	(e: 'close'): void;
}>();

const seriesURL = ref(props.series.url);
const seriesName = ref(props.series.name);
</script>

<template>
  <form
    action=""
    method="dialog"
    class="flex flex-row flex-wrap p-4"
    @submit.prevent="emit('update:series', {name: seriesName, url: seriesURL})">
    <header class="mb-4 flex w-full flex-row items-center justify-between">
      <h2 class="filter-title">
        {{ props.series && props.series.id ? 'Update' : 'Create' }}
      </h2>
    </header>
    <label v-if="props.series" for="name" class="label mb-3 w-full">
      <span>Name</span>
      <input
        v-model="seriesName"
        type="text"
        name="name"
        class="input mt-1 w-full">
    </label>
    <label v-if="props.series" for="url" class="label mb-3 w-full">
      <span>URL</span>
      <input
        v-model="seriesURL"
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