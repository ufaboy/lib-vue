<template>
  <ul>
    <li>
      <router-link :to="{ name: 'book-create'}" class="capitalize flex w-full p-3">create</router-link>
    </li>
    <li class="p-3">
      <input type="search" class="input-text w-full" placeholder="search" @input="debounceSearch" v-model="queryData.searchQuery">
    </li>

    <li class="p-3">
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
    <!--    <input type="search" class="sidebar-input search-text" v-model.trim="searchQuery" placeholder="Search ..."
               @input="debounceGetBooksAndReplace">


        <select class="sidebar-btn form-field__select" v-model="orderBy.name"
                @change="getBooksAndReplace">
          <option v-for="(option, index) of columns" :value="option" :key="option + index">{{ option }}
          </option>
        </select>
        <button class="btn-icon sidebar-btn" @click="changeSortAsc">
          <IconSortAsc class="icon" v-if="orderBy.asc"/>
          <IconSortDesc class="icon" v-else/>
        </button>
        <div class="toggle-three-state" v-if="getAdAccess()">
          <label class="three-state-label">Off
            <input type="radio" class="3state-input" :value="false" v-model="filter.ad" @change="getBooksAndReplace">
          </label>
          <label class="three-state-label">AD
            <input type="radio" class="3state-input" :value="undefined" v-model="filter.ad"
                   @change="getBooksAndReplace">
          </label>
          <label class="three-state-label">On
            <input type="radio" class="3state-input" :value="true" v-model="filter.ad" @change="getBooksAndReplace">
          </label>
        </div>-->
  </ul>
</template>

<script lang="ts" setup>
import {ref, defineEmits} from 'vue'
import {QueryData} from '../../interfaces/book';

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
  queryData: QueryData
}>()
const emit = defineEmits(['search-input', 'load-data'])
let debounce: number | undefined = undefined;

const genreId = ref(null)

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

  const data = {...props.queryData, genre: genre}
  emit('load-data', data)
}
</script>

<style lang="scss">

</style>