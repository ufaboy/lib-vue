<template>
  <aside id="sidebar" class="flex flex-col fixed left-0 top-0 h-full w-[10rem] bg-white dark:bg-slate-900">
    <ul class="navigator-desktop overflow-x-hidden overflow-y-auto">
      <li class="navigator-element hover:bg-sky-400 hover:text-white hover:dark:bg-slate-700 mb-2 text-slate-900 dark:text-white cursor-pointer"
          v-for="(route, index) in routes" :key="index">
        <router-link class="navigator-link flex w-full py-1 px-2" :to="route.value">{{ route.name }}</router-link>
      </li>
    </ul>
    <slot></slot>
    <div id="sidebar-target"></div>
    <ul class="mt-auto">
      <li class="p-2 flex justify-center">
        <ThemeToggle />
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useRoute} from 'vue-router'
import useBooks from "../../composables/useBooks";
import ThemeToggle from "../ThemeToggle.vue";

interface Category {
  id: number,
  name: string,
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
  genres?: Array<Genre>
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

function sendLoadEvent() {
  emit('load-data', queryData.value)
}
const tableMenuShow = computed(() => {
  return route.name === 'book-index'
})
</script>

<style lang="scss">

</style>