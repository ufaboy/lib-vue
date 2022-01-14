<template>
  <div class="books-table">
    <teleport to="#aside" :disabled="isMobile()">
      <section class="sidebar">
        <input type="search" class="sidebar-input search-text" v-model.trim="searchQuery" placeholder="Search ..."
               @input="debounceGetBooksAndReplace">
        <router-link :to="{ name: 'book-create'}" class="sidebar-btn btn-outline create-btn">create</router-link>
        <select class="sidebar-btn form-field__select" v-model="filter.genre"
                @change="getBooksAndReplace">
          <option :value="{}" v-if="!filter.genre?.id">genre</option>
          <optgroup :label="category.name" v-for="category of categories" :key="'category-' + category.id">
            <option v-for="genre of category.genres"
                    :key="'select-genre'+genre.id"
                    :value="genre">{{ genre.name }}
            </option>
          </optgroup>
        </select>
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
        </div>
      </section>
    </teleport>

    <table class="table">
      <thead class="thead">
      <tr tabindex="0">
        <th class="th" :class="columnsClasses[column]" v-for="(column, index) of columns" :key="index">
          <div class="table-cell" :class="{'active' : orderBy.name === column}">
            <div class="td-title">{{ column }}</div>
            <button class="td-action" @click="sortBy(column)">
              <IconSortAsc class="icon" v-if="orderBy.name === column && orderBy.asc"/>
              <IconSortDesc class="icon" v-else/>
            </button>
          </div>
        </th>
      </tr>

      </thead>
      <tbody tabindex="0">
      <tr class="row" :class="{'picante': book.ad}"
          v-for="(book, index) of books.items" :key="book.id" :tabindex="index + 1">
        <td class="td" :class="columnsClasses.id" @click="openBook(book, 'edit')">{{ book.id }}</td>
        <td class="td" :class="columnsClasses.name" @click="openBook(book, 'view')">{{ book.name }}</td>
        <td class="td" :class="columnsClasses.annotation" :data-tooltip="book.annotation" data-tooltip-location='right'>
          <p class="limited-p">{{ book.annotation }}</p>
        </td>
        <td class="td" :class="columnsClasses.genres">
          <div v-for="(genre, index) of book.genres" :key="index">{{ book.genres.length ? genre.name : '' }}</div>
        </td>
        <td class="td" :class="columnsClasses.rating">{{ book.rating }}</td>
        <td class="td" :class="columnsClasses.view_count">{{ book.view_count }}</td>
        <td class="td" :class="columnsClasses.last_read">{{ getDate(book.last_read) }}</td>
        <td class="td" :class="columnsClasses.updated_at">{{ getDate(book.updated_at) }}</td>
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
    <div class="table-paginator" v-else>
      <button class="btn-outline table-pag__btn" v-if="books._links.first"
              @click="toPage(books._links.first)">first
      </button>
      <button class="btn-outline table-pag__btn" :class="{active: page === item}" v-for="(item, index) in paginator"
              :key="index"
              @click="setPageNumber(item)">{{ item }}
      </button>
      <button class="btn-outline table-pag__btn" v-if="books._links.last"
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


document.title = 'Table Books';
const columns = ['id', 'name', 'annotation', 'genres', 'rating', 'view_count', 'last_read', 'updated_at']
const columnsClasses: ColumnsClasses = {
  id: 'cell-id',
  name: 'cell-name',
  annotation: 'cell-annotation',
  genres: 'cell-genre',
  rating: 'cell-rating',
  view_count: 'cell-view_count',
  last_read: 'cell-last_read',
  updated_at: 'cell-updated_at'
}
interface ColumnsClasses {
  [key: string]: string,
  id: string,
  name: string,
  annotation: string,
  genres: string,
  rating: string,
  view_count: string,
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

loadOrderBy();
getBooksAndReplace();
</script>

<style lang="scss">
.books-table {
  padding: 0 1.5rem;

  .btn {
    text-transform: capitalize;
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
@media only screen and (min-width: 893px) {
  .table {
    .cell-id {
      min-width: 75px;
      max-width: 75px;
    }

    .cell-name {
      min-width: 15vw;
      max-width: 15vw;
    }

    .cell-annotation {
      min-width: 20vw;
      max-width: 20vw;

      .limited-p {
        position: relative;
        display: -webkit-box;
        line-height: 1;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

    }

    .cell-genre {
      min-width: 10vw;
      max-width: 10vw;
    }

    .cell-rating {
      min-width: 100px;
      max-width: 100px;
    }

    .cell-view_count {
      min-width: 150px;
      max-width: 150px;
    }

    .cell-last_read {
      min-width: 130px;
      max-width: 130px;
    }

    .th cell-updated_at {
      min-width: 130px;
      max-width: 130px;
    }
  }
}

@media only screen and (max-width: 892px) {
  .books-table {
    padding: 0;
    height: calc(100% - 3.5rem);

    .sidebar {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;

      .sidebar-btn {
        width: 49%;
      }
    }

    .table {
      .cell-genre, .cell-rating {
        max-width: initial;
        min-width: initial;
      }
    }

    .table-paginator {
      justify-content: space-between;

      .table-pag__btn {
        padding: 5px;
        margin-right: 5px;
      }

      .table-pag__btn:last-of-type {
        margin-right: 0;
      }
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {
  .books-table {
    .table {
      .cell-annotation, .cell-view_count, .cell-updated_at {
        display: none;
      }

      .cell-rating {
        max-width: initial;
        min-width: initial;
      }
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {
  .books-table {
    .header {
      .create-btn {
        display: none;
      }
    }

    .table {
      .cell-annotation, .cell-id, .cell-view_count, .cell-last_read, .cell-updated_at {
        display: none;
      }

      .cell-name {
        max-width: 7rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
