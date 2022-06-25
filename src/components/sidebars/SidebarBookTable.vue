<template>
  <ul>
    <li class="hover:dark:bg-slate-700 mb-2 text-slate-900 dark:text-white cursor-pointer">
      <router-link :to="{ name: 'book-create'}" class="capitalize flex w-full p-1">create</router-link>
    </li>
    <li class="py-1 px-2">
      <input type="search" class="input-text w-full" placeholder="search" @input="debounceSearch" v-model="queryData.searchQuery">
    </li>
    <li class="py-1 px-2">
      <select class="select w-full p-1" v-model="genreId"
              @change="sendLoadEvent">
        <option class="flex w-full p-1" :value="null">select genre</option>
        <optgroup :label="category.name" v-for="category of categories" :key="'category-' + category.id">
          <option class="flex w-full p-1" v-for="genre of category.genres"
                  :key="'select-genre'+genre.id"
                  :value="genre.id">{{ genre.name }}
          </option>
        </optgroup>
      </select>
    </li>
    <li class="py-1 px-2">
      <select class="select w-full p-1" v-model="limit"
              @change="sendLoadEvent">
        <option class="flex w-full p-1" :value="limit" v-for="limit in limits">{{limit}}</option>
      </select>
    </li>
    <li class="py-1 px-2 flex flex-row justify-center">
      <TheToggle v-model="ad" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue'
import {QueryData} from '../../interfaces/book';
import {getAdAccess} from "../../utils/userData";
import TheToggle from "../TheToggle.vue";

interface Category {
  id: number,
  name: string,
}

interface Genre {
  [key: string]: number | string | Category | boolean
  id: number,
  name: string,
  description: string,
  category: Category,
  ad: boolean,
  created_at: number,
}

interface CategoryExtended extends Category {
  genres?: Array<Genre>
}

const props = defineProps<{
  categories: CategoryExtended[],
  queryData: QueryData,
}>()
const emit = defineEmits(['search-input', 'load-data'])
let debounce: number | undefined = undefined;

const genreId = ref(null)
const ad = ref<boolean|null>(null)
const limit = ref<number>(10)
const limits = [10, 20, 25, 50, 100]

watch(ad, () => sendLoadEvent())
function debounceSearch(event: Event) {
  const eventTarget = event.target as HTMLInputElement
  clearTimeout(debounce)
  debounce = setTimeout(() => {
    emit('search-input', eventTarget.value)
  }, 600)
}

function sendLoadEvent() {
  let genre = null
  props.categories.find(category => {
    genre = category.genres?.find(item => item.id === genreId.value)
    return !!genre
  })

  const data = {...props.queryData, genre: genre, ad: ad.value, limit: limit.value}
  emit('load-data', data)
}
</script>

<style lang="scss">

</style>