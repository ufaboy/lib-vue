<template>
  <main class="books-table ">
    <table class="table border-collapse h-fit">
      <thead class="thead sticky top-0">
      <tr tabindex="0">
        <th class="th py-2 px-1" :class="{'text-primary' : queryData.orderBy === column}" v-for="(column, index) of columns" :key="index">
          <div class="flex flex-row flex-nowrap" >
            <div class="td-title mr-1">{{ column }}</div>
            <button class="td-action" @click="sortBy(column)">
              <IconSort class="icon" v-if="queryData.orderBy === column" :ascending="queryData.ascending"/>
            </button>
          </div>
        </th>
      </tr>
      </thead>
      <tbody tabindex="0">
      <tr class="row cursor-pointer hover:dark:bg-slate-700" :class="{'picante': book.ad}"
          v-for="(book, index) of books.items" :key="book.id" :tabindex="index + 1">
        <td class="td" @click="openBook(book, 'edit')">{{ book.id }}</td>
        <td class="td w-72" @click="openBook(book, 'view')">
          <p class="limited-p max-w-[13rem]">{{ book.name }}</p>
        </td>
        <td class="td w-72 text-ellipsis" :data-tooltip="book.annotation" data-tooltip-location='top'>
          <p class="limited-p max-w-[13rem]">{{ book.annotation }}</p>
        </td>
        <td class="td w-48" :data-tooltip="calcGenres(book.genres)" data-tooltip-location='top'>
          <p class="limited-p max-w-[10rem]">{{ calcGenres(book.genres) }}</p>
        </td>
        <td class="td">{{ book.rating }}</td>
        <td class="td">{{ book.view_count }}</td>
        <td class="td">{{ book.author ? book.author.name : '' }}</td>
        <td class="td">{{ getDate(book.last_read) }}</td>
        <td class="td">{{ getDate(book.updated_at) }}</td>
      </tr>
      </tbody>
    </table>
    <div class="table-paginator" v-if="isMobile()">
      <button class="btn-outline table-pag__btn" v-if="books._links.first"
              @click="toPage(books._links.first)">first
      </button>
      <button class="btn-outline table-pag__btn" v-if="books._links.prev"
              @click="toPage(books._links.prev)">prev
      </button>
      <button class="btn-outline table-pag__btn" v-if="books._links.self"
              @click="toPage(books._links.self)">{{ books._meta ? books._meta.currentPage : '' }}
      </button>
      <button class="btn-outline table-pag__btn" v-if="books._links.next"
              @click="toPage(books._links.next)">next
      </button>
      <button class="btn-outline table-pag__btn" v-if="books._links.last"
              @click="toPage(books._links.last)">last
      </button>
      <select class="select" @change="getBooksAndReplace" v-model="queryData.page">
        <option :value="pageNum" v-for="(pageNum, index) of pagBtnArr" :key="'page-' + index">{{ pageNum }}</option>
      </select>
    </div>
    <div class="table-paginator flex justify-center my-3" v-else>
      <button class="hover:bg-slate-500 w-12 h-12 mr-2 p-2 border rounded shrink-0" v-if="books._links.first"
              @click="toPage(books._links.first)">first
      </button>
      <button class="hover:bg-slate-500 w-12 h-12 mr-2 p-2 border rounded shrink-0" :class="{'bg-green-900': queryData.page === item}" v-for="(item, index) in paginator"
              :key="index"
              @click="setPageNumber(item)">{{ item }}
      </button>
      <button class="hover:bg-slate-500 w-12 h-12 mr-2 p-2 border rounded shrink-0" v-if="books._links.last"
              @click="toPage(books._links.last)">last
      </button>
    </div>
    <teleport to="#sidebar-target" v-if="!isMobile() && isMounted">
      <hr class="my-3">
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

interface ColumnsClasses {
  [key: string]: string,
  id: string,
  name: string,
  annotation: string,
  genres: string,
  rating: string,
  view_count: string,
  author: string,
  last_read: string,
  updated_at: string,
}

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
onMounted(() => {
  isMounted.value = true
})
cutLimitByHeight()
loadQuery();
getBooksAndReplace();
</script>
