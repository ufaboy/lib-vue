<template>
  <div class="books-table overflow-x-hidden overflow-y-auto">
    <HeaderMobile v-if="isMobile()" />
    <Sidebar v-else>
      <ul>
        <li>
          <input type="search" class="text-black w-full" @input="debounceSearch" v-model="queryData.searchQuery">
        </li>
        <li>
          <router-link :to="{ name: 'book-create'}" class="capitalize">create</router-link>
        </li>
        <li>
          <select class="sidebar-btn form-field__select" v-model="queryData.genre"
                  @change="sendLoadEvent">
            <option :value="{}" v-if="!queryData.genre?.id">genre</option>
            <optgroup :label="category.name" v-for="category of categories" :key="'category-' + category.id">
              <option v-for="genre of category.genres"
                      :key="'select-genre'+genre.id"
                      :value="genre">{{ genre.name }}
              </option>
            </optgroup>
          </select>
        </li>
        <li></li>
        <li></li>
        <li></li>
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
    </Sidebar>
    <table class="table border-collapse h-fit">
      <thead class="thead sticky top-0">
      <tr tabindex="0">
        <th class="th py-2" :class="{active: orderBy.name === column}" v-for="(column, index) of columns" :key="index">
          <div class="flex flex-row flex-nowrap" :class="{'active' : orderBy.name === column}">
            <div class="td-title mr-2">{{ column }}</div>
            <button class="td-action" @click="sortBy(column)">
              <IconSortAsc class="icon" v-if="orderBy.name === column && orderBy.asc"/>
              <IconSortDesc class="icon" v-else/>
            </button>
          </div>
        </th>
      </tr>

      </thead>
      <tbody tabindex="0">
      <tr class="row cursor-pointer" :class="{'picante': book.ad}"
          v-for="(book, index) of books.items" :key="book.id" :tabindex="index + 1">
        <td class="td" @click="openBook(book, 'edit')">{{ book.id }}</td>
        <td class="td w-72" @click="openBook(book, 'view')">
          <p class="limited-p max-w-[13rem]">{{ book.name }}</p>
        </td>
        <td class="td w-72 text-ellipsis" :data-tooltip="book.annotation" data-tooltip-location='top'>
          <p class="limited-p max-w-[13rem]">{{ book.annotation }}</p>
        </td>
        <td class="td w-52" :data-tooltip="calcGenres(book.genres)" data-tooltip-location='top'>
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
      <select class="select" @change="getBooksAndReplace" v-model="page">
        <option :value="pageNum" v-for="(pageNum, index) of pagBtnArr" :key="'page-' + index">{{ pageNum }}</option>
      </select>
    </div>
    <div class="table-paginator flex justify-center mt-4" v-else>
      <button class="hover:bg-slate-500 w-12 mr-2 p-2 border rounded" v-if="books._links.first"
              @click="toPage(books._links.first)">first
      </button>
      <button class="hover:bg-slate-500 w-12 mr-2 p-2 border rounded" :class="{'bg-green-900': page === item}" v-for="(item, index) in paginator"
              :key="index"
              @click="setPageNumber(item)">{{ item }}
      </button>
      <button class="hover:bg-slate-500 w-12 mr-2 p-2 border rounded" v-if="books._links.last"
              @click="toPage(books._links.last)">last
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {isMobile} from "../../utils/helpers";
import {getAdAccess} from "../../utils/userData";
import useBooks from "../../composables/useBooks";
import useBook from "../../composables/useBook";
import useDate from "../../composables/useDate";
import IconSortAsc from '@/components/icons/IconSortAsc.vue'
import IconSortDesc from '@/components/icons/IconSortDesc.vue'
import Sidebar from "../../components/Sidebar.vue";

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
    id: number,
    name: string,
    description: string,
    category: Category,
    ad: number,
    created_at: number,
}
const props = defineProps<{
  categories: Category[]
}>()
const {
  filter, searchQuery, orderBy, limit, books, page, paginator, pagBtnArr, loadOrderBy,
  sortBy, toPage, getBooksAndReplace, setPageNumber, debounceGetBooksAndReplace
} = useBooks();
const {openBook} = useBook();
const {getDate} = useDate();

function changeSortAsc() {
  orderBy.value.asc = !orderBy.value.asc
  page.value = 1
  getBooksAndReplace()
}

function calcGenres(genres:Genre[]) {
  return genres.reduce((previousValue:string, currentValue:Genre, index:number, array:Genre[]):string => {
    return previousValue += index !== array.length ? `${currentValue.name}, ` : `${currentValue.name}`;
  }, '' )
}

loadOrderBy();
getBooksAndReplace();
</script>

<style lang="scss">
.books-table {
  padding: 0 1.5rem;
  .td-action {
    opacity: 0;
  }

  .th:hover, .th.active {
    .td-action {
      opacity: 1;
    }
  }

  .table-paginator {
    .select {
      min-width: 3.5rem;
      padding: 5px;
      margin-left: 5px;
    }
  }
}
.toggle-three-state {
  display: flex;
  flex: 1;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 0.5rem;
  .three-state-label {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    input {
      margin-top: 5px;
    }
  }
}
</style>
