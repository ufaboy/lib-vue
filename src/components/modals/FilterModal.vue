<template>
  <form class="flex flex-row flex-wrap text-slate-900 dark:text-white"
        method="dialog" @submit.prevent="sendFilterEvent">
    <header class="w-full flex flex-row justify-between items-center">
      <h2 class="filter-title">Filter & Sort</h2>
      <button class="close-btn" type="reset" @click="closeModal">
        <IconClose class="icon" />
      </button>
    </header>
    <label class="w-full mt-4">Name</label>
    <input type="search" class="w-full mt-2 p-2 dark:bg-zinc-700" v-model="filter.searchQuery">
    <label class="w-full mt-4">Genre</label>
    <select class="w-full mt-2 p-2 dark:bg-zinc-700" v-model="filter.genre">
      <option class="flex w-full p-1" :value="null">select genre</option>
      <optgroup :label="category.name" v-for="category of categories" :key="'category-' + category.id">
        <option v-for="genre of category.genres"
                :key="'select-genre'+genre.id"
                :value="genre">{{ genre.name }}
        </option>
      </optgroup>
    </select>
    <label class="w-full mt-4">Ad</label>
    <select class="w-full mt-2 p-2 dark:bg-zinc-700" v-model="filter.ad">
      <option :value="null">Show All</option>
      <option :value="false">Hide AD</option>
      <option :value="true">Show only AD</option>
    </select>
    <label class="w-full mt-4">Rating</label>
    <select class="w-full mt-2 p-2 dark:bg-zinc-700" v-model="filter.rating" name="selectRating">
      <option class="value" :value="rating.value" v-for="(rating, index) of ratingOptions"
              :key="'rating-' + index">{{ rating.value }} {{ rating.name }}
      </option>
    </select>
    <label class="w-full mt-4">Sort by</label>
    <select class="w-full mt-2 p-2 dark:bg-zinc-700" v-model="filter.orderBy">
      <option class="capitalize " :value="sortOption" v-for="sortOption in sortingOptions">{{sortOption}}</option>
    </select>
    <label class="w-full mt-4">Ascending</label>
    <select class="w-full mt-2 p-2 dark:bg-zinc-700" v-model="filter.ascending">
      <option :value="true">up</option>
      <option :value="false">down</option>
    </select>
    <footer class="w-full mt-4 flex flex-row justify-between items-center">
      <button class="btn-red" type="reset" @click="resetFilter">Reset</button>
      <button class="btn-green">Find</button>
    </footer>
  </form>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {getAdAccess} from "../../utils/userData";
import {Genre} from "../../interfaces/genre";
import {CategoryExtended} from "../../interfaces/category";
import {QueryData} from "../../interfaces/book";
import IconClose from "../../components/icons/IconClose.vue"


interface Filter {
  ad: boolean|null
  rating: number|null
  searchQuery: string|null
  genre: Genre|null
  orderBy: string
  ascending: boolean
}
interface Props {
  queryData: QueryData
  categories: CategoryExtended[]
}
const emit = defineEmits(['active-filter', 'hide-modal', 'reset-filter'])
const props = defineProps<Props>()

const sortingOptions = ['name', 'view_count', 'rating', 'updated_at', 'last_read'];
const ratingOptions = [
  {name: 'All rating', value: 0},
  {name: 'Terrible', value: 1},
  {name: 'Bad', value: 2},
  {name: 'Middle', value: 3},
  {name: 'Good', value: 4},
  {name: 'Fine', value: 5},
]
const adAccess = getAdAccess()

const filter = ref<Filter>({
  genre: null,
  rating: null,
  ad: null,
  searchQuery: '',
  orderBy: 'updated_at',
  ascending: false
})

function loadFilter() {
  const {genre, rating, ad, searchQuery, orderBy, ascending} = {...props.queryData}
  filter.value.rating = rating ?? null
  filter.value.ad = ad ?? null
  filter.value.orderBy = orderBy ?? null
  filter.value.searchQuery = searchQuery ?? null
  filter.value.ascending = ascending ?? null
  filter.value.genre = genre ?? null
}

function closeModal() {
  emit('hide-modal')
}

function resetFilter() {
  emit('reset-filter')
  closeModal()
}

function sendFilterEvent() {
  emit('active-filter', {...props.queryData, ...filter.value})
  closeModal()
}

loadFilter()
</script>
