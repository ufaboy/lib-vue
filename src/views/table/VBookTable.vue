<template>
  <main class="books-table">
    <table class="table border-collapse h-fit">
      <thead class="thead sticky top-0">
      <tr tabindex="0">
        <th class="th py-2 px-1" :class="{'text-primary' : queryData.orderBy === column}" v-for="(column, index) of filteredColumns" :key="index">
          <div class="flex flex-row flex-nowrap group">
            <div class="td-title mr-1">{{ column }}</div>
            <button class="td-action w-4" @click="sortBy(column)">
              <IconSort class="icon hidden group-hover:block"
                        :class="{'!block': queryData.orderBy === column}"
                        :ascending="queryData.ascending" />
            </button>
          </div>
        </th>
      </tr>
      </thead>
      <tbody tabindex="0">
      <tr class="row cursor-pointer hover:bg-sky-300 hover:dark:bg-slate-700 border-b border-black dark:border-white" :class="{'picante': book.ad}"
          v-for="(book, index) of books.items" :key="book.id" :tabindex="index + 1">
        <td v-if="filteredColumns.includes('id')" class="p-2" @click="openBook(book, 'edit')">{{ book.id }}</td>
        <td v-if="filteredColumns.includes('name')" class="p-2 w-64" @click="openBook(book, 'view')">
          <p class="line-clamp-2 max-w-[13rem]">{{ book.name }}</p>
        </td>
        <td v-if="filteredColumns.includes('annotation')" class="p-2 w-64 text-ellipsis" :data-tooltip="book.annotation" data-tooltip-location='top'>
          <p class="line-clamp-2 max-w-[13rem]">{{ book.annotation }}</p>
        </td>
        <td v-if="filteredColumns.includes('genres')" class="p-2 w-48" :data-tooltip="calcGenres(book.genres)" data-tooltip-location='top'>
          <p class="line-clamp-2 max-w-[10rem]">{{ calcGenres(book.genres) }}</p>
        </td>
        <td v-if="filteredColumns.includes('rating')" class="p-2">{{ book.rating }}</td>
        <td v-if="filteredColumns.includes('view_count')" class="p-2">{{ book.view_count }}</td>
        <td v-if="filteredColumns.includes('author')" class="p-2">{{ book.author ? book.author.name : '' }}</td>
        <td v-if="filteredColumns.includes('last_read')" class="p-2">{{ getDate(book.last_read) }}</td>
        <td v-if="filteredColumns.includes('updated_at')" class="p-2">{{ getDate(book.updated_at) }}</td>
      </tr>
      </tbody>
    </table>
    <div class="table-paginator" v-if="isMobile()">
      <select class="select" @change="getBooksAndReplace" v-model="queryData.page">
        <option :value="pageNum" v-for="(pageNum, index) of pagBtnArr" :key="'page-' + index">{{ pageNum }}</option>
      </select>
      <select class="select" multiple @change="saveColumns" v-model="filteredColumns">
        <option :value="column" v-for="column of columns">{{ column }}</option>
      </select>
    </div>
    <div class="table-paginator flex justify-center my-3" v-else>
      <button class="hover:bg-sky-300 dark:hover:bg-slate-500 w-10 h-10 mr-2 p-1 border rounded shrink-0" v-if="books._links.first"
              @click="toPage(books._links.first)">first
      </button>
      <button class="hover:bg-sky-300 dark:hover:bg-slate-500 w-10 h-10 mr-2 p-1 border rounded shrink-0" :class="{'text-white bg-green-500': queryData.page === item}" v-for="(item, index) in paginator"
              :key="index"
              @click="setPageNumber(item)">{{ item }}
      </button>
      <button class="hover:bg-sky-300 dark:hover:bg-slate-500 w-10 h-10 mr-2 p-1 border rounded shrink-0" v-if="books._links.last"
              @click="toPage(books._links.last)">last
      </button>
    </div>
    <teleport to="#sidebar-target" v-if="!isMobile() && isMounted">
      <hr class="my-1">
      <SidebarBookTable :categories="categories" :queryData="queryData"
                        @search-input="searchInputHandler"
                        @load-data="updateFilterPage" />
    </teleport>
  </main>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {isMobile} from "../../utils/helpers";
import {getAdAccess} from "../../utils/userData";
import useBooks from "../../composables/useBooks";
import useBook from "../../composables/useBook";
import useDate from "../../composables/useDate";
import IconSort from '@/components/icons/IconSort.vue'
import Sidebar from "../../components/sidebars/Sidebar.vue";
import SidebarBookTable from '../../components/sidebars/SidebarBookTable.vue';

document.title = 'Table Books';
const columns = ['id', 'name', 'annotation', 'genres', 'rating', 'view_count', 'author', 'last_read', 'updated_at']
const filteredColumns = ref<string[]>([''])

interface Category {
    id: number,
    name: string,
    genres?: Array<Genre>
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
const props = defineProps<{
  categories: Category[]
}>()
const emit = defineEmits(['search-input'])
const {
  queryData, books, paginator, pagBtnArr, loadQuery, saveQuery, updateFilterPage,
  sortBy, toPage, getBooksAndReplace, setPageNumber, debounceGetBooksAndReplace
} = useBooks();
const {openBook} = useBook();
const {getDate} = useDate();

const isMounted = ref(false)

function searchInputHandler(e: string | undefined) {
  queryData.value.searchQuery = e
  getBooksAndReplace()
}

function calcGenres(genres:Genre[]) {
  return genres.reduce((previousValue:string, currentValue:Genre, index:number, array:Genre[]):string => {
    return previousValue += index !== array.length - 1 ? `${currentValue.name}, ` : `${currentValue.name}`;
  }, '' )
}
function cutLimitByHeight() {
  const x = Math.floor(window.innerHeight / 80)
  queryData.value.limit = x
  console.log('height', window.innerHeight, x)
}

function saveColumns() {
  localStorage.setItem('book-columns', JSON.stringify(filteredColumns.value) )
}
function getColumns() {
  const cols = localStorage.getItem('book-columns')
  filteredColumns.value = cols ? JSON.parse(cols) : columns
}
getColumns()
onMounted(() => {
  isMounted.value = true
})
cutLimitByHeight()
loadQuery();
getBooksAndReplace();
</script>
