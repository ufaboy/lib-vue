<script setup lang="ts">
import { ref } from 'vue';
import { useTag } from '@/composables/tags';
import type { Tag} from '@/interfaces/tag';

const props = defineProps<{
	tag?: Tag;
}>();
const emit = defineEmits<{
	(e: 'update:tag', tag: Partial<Tag>): void;
	(e: 'close'): void;
}>();

const { updateTag } = useTag();
const id = ref<number>()
const name = ref<string>();

if(props.tag) {
  id.value = props.tag.id || 0;
  name.value = props.tag.name || '';
}
</script>

<template>
  <form
    action=""
    method="dialog"
    class="flex flex-row flex-wrap p-4"
    @submit="updateTag">
    <header class="mb-4 flex w-full flex-row items-center justify-between">
      <h2 class="filter-title">
        {{ tag && tag.id ? 'Update' : 'Create' }}
      </h2>
    </header>
    <label v-if="tag" for="name" class="label mb-3 w-full">
      <span>Name</span>
      <input
        v-model="name"
        type="text"
        name="name"
        class="input mt-1 w-full">
    </label>
    <input
      type="number"
      name="id"
      hidden
      :value="id">
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