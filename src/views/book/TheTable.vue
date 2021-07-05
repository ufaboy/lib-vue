<template>
  <div class="books-table">
    <header class="header">
      <router-link :to="{ name: 'book-create'}" class="btn create-btn">create</router-link>
      <button class="btn" @click="showFilterModal">filter</button>
      <input type="search" class="search-text" v-model.trim="bookName" placeholder="Search by name..."
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
        <td class="td" :class="columnsClasses.id" @click="openBook(book, 'edit')">{{ book.id }}</td>
        <td class="td" :class="columnsClasses.name" @click="openBook(book, 'view')">{{ book.name }}</td>
        <td class="td" :class="columnsClasses.annotation">{{ book.annotation }}</td>
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
      <button class="btn table-pag__btn" v-if="books._links.first"
              @click="toPage(books._links.first)">first
      </button>
      <button class="btn table-pag__btn" v-if="books._links.prev"
              @click="toPage(books._links.prev)">prev
      </button>
      <button class="btn table-pag__btn" v-if="books._links.self"
              @click="toPage(books._links.self)">{{ books._meta ? books._meta.currentPage : '' }}
      </button>
      <button class="btn table-pag__btn" v-if="books._links.next"
              @click="toPage(books._links.next)">next
      </button>
      <button class="btn table-pag__btn" v-if="books._links.last"
              @click="toPage(books._links.last)">last
      </button>
      <select class="select" @change="getBooksPage" v-model="page" v-if="$store.state.main.isMobile">
        <option :value="pageNum" v-for="(pageNum, index) of pagBtnArr" :key="'page-' + index">{{ pageNum }}</option>
      </select>
    </div>
    <modal ref="filterBookModal">
      <filter-modal @active-filter="updateFilterPage"
                    @reset-filter="resetTable"
                    :rating="filter.rating"
                    :genre="filter.genre"
                    :ad="filter.ad"/>
    </modal>
  </div>
</template>

<script>
import {mapState} from "vuex";
import IconSortAsc from '@/components/icons/IconSortAsc.vue'
import IconSortDesc from '@/components/icons/IconSortDesc.vue'
import FilterModal from '@/components/FilterModal.vue'

export default {
  name: "BooksTable",
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
    async openBook(book, type) {
      const comicsBook = book.genres.findIndex(genre => genre.parent.name === 'comics') > -1
      await this.$router.push({
        name: type === 'edit' ? 'book-edit' : comicsBook ? 'book-media' : 'book-view',
        params: {id: book.id}
      })
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
      this.filter.ad = filter.ad ? 1 : 0
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
      if (Number.isInteger(this.filter.ad)) {
        url += `&ad=${this.filter.ad}`
      }
      this.$loader.show()
      const result = await this.$get(url);
      this.$loader.hide()
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
      this.getBooksPage();
    },
    getThumbs(book) {
      return book.cover_url ? `${this.$config.apiUrl}/${book.cover_url}` : '/img/book-cover.jpg'
    },
    async toPage(url) {
      const result = await this.goPage(url.href)
      if (result) {
        this.books = result;
      } else console.log({'goPage': result})
    },

    showFilterModal() {
      this.$modal.show('filterBookModal', this)
    }
  },
  computed: {
    ...mapState({
      main: state => state.main,
    }),
    modalSize() {
      return this.main.isDesktop ? 600 : '100%'
    },
  },
  watch: {},
  created() {
    document.title = 'Table Books';
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
  height: calc(100% - 3.5rem);
  padding: 1rem 1.5rem;

  .btn {
    text-transform: capitalize;
  }

  .header {
    display: flex;
    justify-content: space-between;
    flex-flow: row nowrap;
    margin-bottom: 0.5rem;

    .search-text {
      color: var(--text2);
      background-color: var(--surface3);
      border-radius: 5px;
      border: none;
      padding: 0 3px;
      display: flex;
      margin-left: 0.5rem;
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
