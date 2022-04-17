<template>
  <aside id="sidebar" class="fixed bg-white dark:bg-neutral-800 left-0 top-0 h-full w-[10rem]">
    <ul class="navigator-desktop overflow-x-hidden overflow-y-auto">
      <li class="navigator-element hover:dark:bg-neutral-700 mb-3 text-slate-900 dark:text-white cursor-pointer"
          v-for="(route, index) in routes" :key="index">
        <router-link class="navigator-link flex w-full p-3" :to="route.value">{{ route.name }}</router-link>
      </li>
    </ul>
    <slot></slot>
  </aside>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useRoute} from 'vue-router'
import useBooks from "../composables/useBooks";

interface Category {
  id: number,
  name: string,
  genres: Array<Genre>
}
interface Genre {
  [key: string]: number|string|Category|boolean
  id: number,
  name: string,
  description: string,
  category: Category,
  ad: boolean,
  created_at: number,
}
interface CategoryExtended extends Category{
  genres: Array<Genre>
}

const route = useRoute()
const emit = defineEmits(['search-input', 'load-data'])
const props = defineProps<{
  categories: CategoryExtended[]
}>()
const routes = [
  {name: 'Home', value: {name: 'list-categories'}},
  {name: 'Books', value: {name: 'book-index'}},
  {name: 'Genre', value: {name: 'genre-index'}},
  {name: 'Note', value: {name: 'note'}},
  {name: 'Media', value: {name: 'media'}},
  {name: 'Authors', value: {name: 'author-index'}},
]
const {queryData, books} = useBooks();
let debounce: number | undefined = undefined;
function debounceSearch (event: Event) {
  const eventTarget = event.target as HTMLInputElement
  clearTimeout(debounce)
  debounce = setTimeout(() => {
    emit('search-input', eventTarget.value)
  }, 600)
}
function sendLoadEvent() {
  emit('load-data', queryData.value)
}
const tableMenuShow = computed(() => {
  return route.name === 'book-index'
})
</script>

<style lang="scss">

</style>