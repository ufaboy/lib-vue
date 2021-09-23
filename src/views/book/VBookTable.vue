<template>
  <div class="books-table">
    <header class="header">
      <router-link :to="{ name: 'book-create'}" class="btn btn--outline create-btn">create</router-link>
      <button class="btn btn--outline filter-btn" @click="showFilterModal">filter {{filterCount ? filterCount : ''}}</button>
      <input type="search" class="search-text" v-model.trim="searchField" placeholder="Search by name..."
             @input="getBooksAndReplace">
    </header>
    <table class="table">
      <thead class="thead">
      <th class="th" :class="$options.columnsClasses[column]" v-for="(column, index) of $options.columns" :key="index">
        <div class="table-cell" :class="{'active' : orderBy.name === column}">
          <div class="td-title">{{ column }}</div>
          <div class="td-action" @click="sortBy(column)">
            <base-icon class="icon" icon-name="sort">
              <icon-sort-asc v-if="orderBy.name === column && orderBy.asc"/>
              <icon-sort-desc v-else/>
            </base-icon>
          </div>
        </div>
      </th>
      </thead>
      <tbody>
      <!--      <transition-group name="flip-list" tag="tbody">-->
      <tr class="row" :class="{'picante': book.ad}" v-for="book of books.items" :key="book.id">
        <td class="td" :class="$options.columnsClasses.id" @click="openBook(book, 'edit')">{{ book.id }}</td>
        <td class="td" :class="$options.columnsClasses.name" @click="openBook(book, 'view')">{{ book.name }}</td>
        <td class="td" :class="$options.columnsClasses.annotation" :data-tooltip="book.annotation" data-tooltip-location='right'>
          <p class="limited-p" >{{ book.annotation }}</p>
        </td>
        <td class="td" :class="$options.columnsClasses.genres">
          <div v-for="(genre, index) of book.genres" :key="index">{{ book.genres.length ? genre.name : '' }}</div>
        </td>
        <td class="td" :class="$options.columnsClasses.rating">{{ book.rating }}</td>
        <td class="td" :class="$options.columnsClasses.view_count">{{ book.view_count }}</td>
        <td class="td" :class="$options.columnsClasses.last_read">{{ getDate(book.last_read) }}</td>
        <td class="td" :class="$options.columnsClasses.updated_at">{{ getDate(book.updated_at) }}</td>
      </tr>
      <!--</transition-group>-->
      </tbody>
    </table>
    <div class="table-paginator">
      <button class="btn btn--outline table-pag__btn" v-if="books._links.first"
              @click="toPage(books._links.first)">first
      </button>
      <button class="btn btn--outline table-pag__btn" v-if="books._links.prev"
              @click="toPage(books._links.prev)">prev
      </button>
      <button class="btn btn--outline table-pag__btn" v-if="books._links.self"
              @click="toPage(books._links.self)">{{ books._meta ? books._meta.currentPage : '' }}
      </button>
      <button class="btn btn--outline table-pag__btn" v-if="books._links.next"
              @click="toPage(books._links.next)">next
      </button>
      <button class="btn btn--outline table-pag__btn" v-if="books._links.last"
              @click="toPage(books._links.last)">last
      </button>
      <select class="select" @change="getBooksAndReplace" v-model="page" v-if="isMobile">
        <option :value="pageNum" v-for="(pageNum, index) of pagBtnArr" :key="'page-' + index">{{ pageNum }}</option>
      </select>
    </div>
    <the-modal v-if="showModal" @hide-modal="showModal = false">
      <filter-modal @active-filter="updateFilterPage"
                    @reset-filter="resetTable"
                    :categories="categories"
                    :rating="filter.rating"
                    :genre="filter.genre"
                    :ad="filter.ad"/>
    </the-modal>
  </div>
</template>

<script>
import {ref, computed} from "vue";
import useDevice from "@/composables/useDevice";
import useBooks from "@/composables/useBooks";
import useBook from "@/composables/useBook";
import useDate from "@/composables/useDate";
import IconSortAsc from '@/components/icons/IconSortAsc.vue'
import IconSortDesc from '@/components/icons/IconSortDesc.vue'
import FilterModal from '@/components/FilterModal.vue'
import TheModal from "@/components/TheModal";

export default {
  name: "BooksTable",
  components: {TheModal, FilterModal, IconSortAsc, IconSortDesc},
  props: {
    categories: Array,
  },
  setup() {
    document.title = 'Table Books';

    const showModal = ref(false);
    const {isMobile, isDesktop} = useDevice();
    const {
      filter, limit, searchField, orderBy, books, page, pagBtnArr, resetTable,
      updateFilterPage, filterCount,
      sortBy, toPage, getBooksAndReplace
    } = useBooks();
    const {openBook} = useBook();
    const {getDate} = useDate();
    const modalSize = computed(() => {
      return isDesktop.value ? 600 : '100%'
    });


    const getThumbs = (book) => {
      return book.cover_url ? `${process.env.VUE_APP_API_URL}/${book.cover_url}` : '/img/book-cover.jpg'
    };


    const showFilterModal = () => {
      showModal.value = true
    };

    getBooksAndReplace();

    return {
      books,
      searchField,
      filter,
      showModal,
      page,
      pagBtnArr,
      limit,
      orderBy,
      isMobile,
      isDesktop,
      modalSize,
      getBooksAndReplace,
      getDate,
      openBook,
      resetTable,
      filterCount,
      updateFilterPage,
      sortBy,
      getThumbs,
      toPage,
      showFilterModal
    }
  },
  columns: ['id', 'name', 'annotation', 'genres', 'rating', 'view_count', 'last_read', 'updated_at'],
  columnsClasses: {
    id: 'cell-id',
    name: 'cell-name',
    annotation: 'cell-annotation',
    genres: 'cell-genre',
    rating: 'cell-rating',
    view_count: 'cell-view_count',
    last_read: 'cell-last_read',
    updated_at: 'cell-updated_at'
  },
}
</script>

<style lang="scss" scoped>
.books-table {
  height: calc(100% - 3.5rem);
  padding: 0.5rem 1.5rem;

  .btn {
    text-transform: capitalize;
  }

  .header {
    display: flex;
    justify-content: space-between;
    flex-flow: row nowrap;
    margin-bottom: 0.5rem;

    .filter-btn, .create-btn {
      margin: 0 0.5rem 0 0;
    }

    .search-text {
      color: var(--text);
      background-color: var(--background-on);
      border-radius: 5px;
      border: none;
      padding: 5px;
      display: flex;
    }

    .btn {
      display: flex;

      align-items: center;
      justify-content: center;
      text-transform: capitalize;
      white-space: nowrap;
    }

    .button:hover {
      background: var(--hovered);
    }


    //.button:last-of-type {
    //  margin-right: 0;
    //}
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

    .header {
      .btn {
        flex: 1;
      }
    }
    .table {
      .cell-genre, .cell-rating {
        max-width: initial;
        min-width: initial;
      }
    }

    .table-paginator {
      justify-content: space-around;

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
        max-width: 11rem;
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
