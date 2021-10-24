<template>
  <div class="books-table">
    <teleport to="#aside" :disabled="isMobile()">
      <section class="sidebar">
        <input type="search" class="sidebar-input search-text mb-half" v-model.trim="searchQuery" placeholder="Search ..."
               @input="getBooksAndReplace">
        <router-link :to="{ name: 'book-create'}" class="sidebar-btn btn-outline create-btn mb-half">create</router-link>
        <button class="sidebar-btn btn-outline mb-half" @click="showFilterModal">filter {{ filterCount ? filterCount : '' }}
        </button>

      </section>
    </teleport>

    <table class="table">
      <thead class="thead">
      <tr>
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
      <tbody>
      <!--      <transition-group name="flip-list" tag="tbody">-->
      <tr class="row" :class="{'picante': book.ad}" v-for="book of books.items" :key="book.id">
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
      <!--</transition-group>-->
      </tbody>
    </table>
    <div class="table-paginator">
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
      <select class="select" @change="getBooksAndReplace" v-model="page" v-if="isMobile()">
        <option :value="pageNum" v-for="(pageNum, index) of pagBtnArr" :key="'page-' + index">{{ pageNum }}</option>
      </select>
    </div>
    <TheModal v-if="showModal" :width="400">
      <FilterModal @active-filter="updateFilterPage"
                    @hide-modal="showModal = false"
                    @reset-filter="resetTable"
                    :categories="categories"
                    :rating="filter.rating"
                    :genre="filter.genre"
                    :ad="filter.ad"/>
    </TheModal>
  </div>
</template>

<script setup>
import {ref,} from "vue";
import {isMobile} from "@/utils/helpers";
import useBooks from "@/composables/useBooks";
import useBook from "@/composables/useBook";
import useDate from "@/composables/useDate";
import IconSortAsc from '@/components/icons/IconSortAsc.vue'
import IconSortDesc from '@/components/icons/IconSortDesc.vue'
import FilterModal from '@/components/FilterModal.vue'
import TheModal from "@/components/TheModal";

document.title = 'Table Books';
const columns = ['id', 'name', 'annotation', 'genres', 'rating', 'view_count', 'last_read', 'updated_at']
const columnsClasses = {
  id: 'cell-id',
  name: 'cell-name',
  annotation: 'cell-annotation',
  genres: 'cell-genre',
  rating: 'cell-rating',
  view_count: 'cell-view_count',
  last_read: 'cell-last_read',
  updated_at: 'cell-updated_at'
}

// eslint-disable-next-line no-undef,no-unused-vars
const props = defineProps({
  categories: Array,
})
const showModal = ref(false);
const {
  filter, searchQuery, orderBy, books, page, pagBtnArr, resetTable,
  updateFilterPage, filterCount, loadOrderBy,
  sortBy, toPage, getBooksAndReplace
} = useBooks();
const {openBook} = useBook();
const {getDate} = useDate();

function showFilterModal() {
  showModal.value = true
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

  .flip-list-enter-active, .flip-list-leave-active {
    transition: all 1s;
  }

  .flip-list-enter, .flip-list-leave-to /* .list-leave-active до версии 2.1.8 */
  {
    //opacity: 0;
    //transform: translateY(30px);
  }

  .flip-list-move {
    transition: transform 1s;
  }

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
    padding: 0.5rem;
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
        max-width: 8rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cell-rating {

        .td-title {
          max-width: 2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 0;
        }
      }
    }
  }
}
</style>
