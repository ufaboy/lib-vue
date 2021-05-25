<template>
  <div class="books-table">
    <header class="header">
      <router-link :to="{ name: 'book-create'}" class="btn create-btn">create</router-link>
      <button class="btn" @click="showFilterModal">filter</button>
      <input type="search" class="searchText" v-model.trim="bookName" placeholder="Search by name..."
             @input="searchByName">
    </header>
    <table class="table">
      <thead class="thead">
      <th class="th" :class="columnsClasses[column]" v-for="(column, index) of columns" :key="index">
        <div class="table-cell" :class="{'active' : orderBy === column}">
          <div class="td-title">{{ column }}</div>
          <div class="td-action" @click="sortBy(column, ascending ? 0 : 1)">
            <base-icon class="icon" icon-name="sort">
              <icon-sort-asc v-if="ascending"/>
              <icon-sort-desc v-else/>
            </base-icon>
          </div>
        </div>
      </th>
      </thead>
      <tbody>
      <!--      <transition-group name="flip-list" tag="tbody">-->
      <tr class="row" :class="{'picante': book.ad}" v-for="book of books.items" :key="book.id">
        <td class="td" :class="columnsClasses.id" @click="openBook(book.id, 'edit')">{{ book.id }}</td>
        <td class="td" :class="columnsClasses.name" @click="openBook(book.id, 'view')">{{ book.name }}</td>
        <td class="td" :class="columnsClasses.annotation">{{ book.annotation }}</td>
        <td class="td" :class="columnsClasses.genres">
          <div v-for="(genre, index) of book.genres" :key="index">{{ book.genres.length ? genre.title : '' }}</div>
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
      <button class="btn table-pag__btn" v-if="books._links.first"
              @click="goPage(books._links.first)">first
      </button>
      <button class="btn table-pag__btn" v-if="books._links.prev"
              @click="goPage(books._links.prev)">prev
      </button>
      <button class="btn table-pag__btn" v-if="books._links.self"
              @click="goPage(books._links.self)">{{ books._meta ? books._meta.currentPage : '' }}
      </button>
      <button class="btn table-pag__btn" v-if="books._links.next"
              @click="goPage(books._links.next)">next
      </button>
      <button class="btn table-pag__btn" v-if="books._links.last"
              @click="goPage(books._links.last)">last
      </button>
      <select class="select" @change="getBooksPage" v-model="page" v-if="$store.state.main.isMobile">
        <option :value="pageNum" v-for="(pageNum, index) of pagBtnArr" :key="'page-' + index">{{ pageNum }}</option>
      </select>
    </div>
    <modal ref="filterBookModal">
      <filter-modal @active-filter="updateFilterPage" @reset-filter="resetTable" :rating="filter.rating"
                    :genre="filter.genre" :ad="filter.ad"/>
    </modal>
  </div>
</template>

<script>
import FilterModal from "@/components/FilterModal";
import {goPage, $get} from "@/service/superFetch";
import IconSortAsc from "@/components/icons/IconSortAsc"
import IconSortDesc from "@/components/icons/IconSortDesc"
export default {
  name: "BooksTable",
  head() {
    return {
      title: 'Table books',
    };
  },
  layout: 'basement',
  middleware: [],
  components: {FilterModal, IconSortAsc, IconSortDesc},
  props: {},
  data: () => ({
    books: {
        items: [],
        _links: {},
        _meta: {},
    },
    bookName: null,
    filter: {
      genre: null,
      rating: null,
      ad: null,
    },
    page: 1,
    pagBtnArr: [],
    limit: 10,
    ascending: 0,
    orderBy: null,
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
  }),
  methods: {
    searchByName() {
      this.getBooksPage()
    },

    getDate(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp * 1000);
      return date ? date.toLocaleString('ru-RU', {year: '2-digit', month: '2-digit', day: 'numeric'}) : null
    },
    async openBook(bookId, type) {
      await this.$router.push({name: type === 'edit' ? 'book-edit' : 'book-view', params: {id: bookId}})
    },
    resetTable() {
      this.filter.genre = null
      this.filter.rating = null
      this.filter.ad = null
      this.getBooksPage()
    },
    updateFilterPage(filter) {
      if (filter?.genre) {
        this.filter.genre = filter.genre
      }
      if (filter?.rating) {
        this.filter.rating = filter.rating
      }
      if (filter?.ad) {
        this.filter.ad = filter.ad
      }
      this.getBooksPage()
    },
    async getBooksPage() {
      let url = `/book?page=${this.page}&limit=${this.limit}&sort=${this.ascending ? '' : '-'}${this.orderBy ? this.orderBy : 'id'}`
      if (this.bookName) {
        url += `&name=${this.bookName}`
      }
      if (this.filter.genre) {
        url += `&genre_id=${this.filter.genre.id}`
      }
      if (this.filter.rating) {
        url += `&rating=${this.filter.rating}`
      }
      if (this.filter.ad) {
        url += `&ad=1`
      }
      this.$loader('show')
      const result = await $get(url);
      this.$loader('hide')
      if (result) {
        this.books = result
        this.page = result._meta.currentPage
        // const count = result._meta.pageCount
        this.pagBtnArr = Array.from({length: result._meta.pageCount}, (v, k) => k + 1);
      }
    },
    sortBy(orderBy, asc) {
      this.orderBy = orderBy
      this.ascending = asc
      const params = {ascending: asc, orderBy: orderBy !== 'genre' ? orderBy : 'genre.title'}
      this.$store.dispatch('books/setParamsLoadBooks', params)
      this.getBooksPage();
    },
    getThumbs(book) {
      return book.cover_url ? `${this.$config.apiUrl}/${book.cover_url}` : '/img/book-cover.jpg'
    },
    async goPage(url) {
      const result = await goPage(url.href)
      if (result) {
        this.books = result;
      } else console.log({'goPage': result})
    },

    showFilterModal() {
      this.$showModal('filterBookModal')
    }
  },
  computed: {
    modalSize() {
      return this.$store.state.isDesktop ? 600 : '100%'
    },
  },
  watch: {},
  created() {
  },
  mounted() {
    this.getBooksPage();
  },
  updated() {
  },
}
</script>

<style lang="scss">
.books-table {
  padding: 0 1.5rem;

  .btn {
    text-transform: capitalize;
  }

  .header {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    flex-flow: row nowrap;

    .searchText {
      color: var(--color-2);
      background-color: var(--background-3);
      border-radius: 5px;
      border: none;
      padding: 0 3px;
      display: flex;
    }

    .btn {
      display: flex;

      align-items: center;
      justify-content: center;
      text-transform: capitalize;
      background: var(--background-2);
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
      width: 65px;
      padding: 5px;
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

}

@media only screen and (max-width: 892px) {
  .books-table {
    padding: 0.5rem;

    .header {
      .btn {
        flex: 1;
      }
    }

    .table-paginator {
      .table-pag__btn {
        padding: 10px 1rem;
      }
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {
  .books-table {
    .table {
      .cell-annotation, .cell-updated_at {
        display: none;
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
