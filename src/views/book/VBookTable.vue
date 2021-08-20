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
        <td class="td" :class="$options.columnsClasses.annotation">{{ book.annotation }}</td>
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
      <select class="select" @change="getBooksAndReplace" v-model="page" v-if="main.isMobile">
        <option :value="pageNum" v-for="(pageNum, index) of pagBtnArr" :key="'page-' + index">{{ pageNum }}</option>
      </select>
    </div>
    <the-modal v-if="showModal" @hide-modal="showModal = false">
      <filter-modal @active-filter="updateFilterPage"
                    @reset-filter="resetTable"
                    :rating="filter.rating"
                    :genre="filter.genre"
                    :ad="filter.ad"/>
    </the-modal>
  </div>
</template>

<script>
import {ref, reactive, computed, inject} from "vue";
import {useRouter} from 'vue-router'
import {useStore} from "vuex";
import {loadBooks, goPage} from "@/utils/loadData";
import IconSortAsc from '@/components/icons/IconSortAsc.vue'
import IconSortDesc from '@/components/icons/IconSortDesc.vue'
import FilterModal from '@/components/FilterModal.vue'
import TheModal from "@/components/TheModal";

export default {
  name: "BooksTable",
  layout: 'basement',
  middleware: [],
  components: {TheModal, FilterModal, IconSortAsc, IconSortDesc},
  setup() {
    document.title = 'Table Books';
    const loader = inject("loader");
    const router = useRouter();
    const store = useStore()
    const showModal = ref(false);
    const bookName = ref('');
    const books = reactive({
      items: [],
      _links: {},
      _meta: {},
    });
    const filter = reactive({
      genre: null,
      rating: null,
      ad: null,
    });
    const page = ref(1);
    const pagBtnArr = reactive([]);
    const limit = ref(10);
    const orderBy = reactive({name: 'updated_at', asc: false});
    const main = computed(()=> store.state.main);
    const modalSize = computed(() => {
      return main.value.isDesktop.value ? 600 : '100%'
    });

    const getBooksAndReplace = async () => {
      const sort = `${orderBy.asc ? '' : '-'}${orderBy.name}`
      // const formFilter = {...toRefs(filter), name: bookName.value}
      const formFilter = {genre: filter.genre, rating: filter.rating, ad: filter.ad, name: bookName.value}
      try {
        loader.show();
        const result = await loadBooks(page.value, limit.value, sort, formFilter)
        loader.hide();
        books._links = result._links
        books._meta = result._meta
        books.items.splice(0, books.items.length)
        books.items.push(...result.items)
        page.value = result._meta.currentPage
        pagBtnArr.value = Array.from({length: result._meta.pageCount}, (v, k) => k + 1);
      } catch (e) {
        console.log({'getBooksAndReplace': e})
      }
    };
    const searchByName = () => {
      getBooksAndReplace()
    };
    const getDate = (timestamp) => {
      if (!timestamp) return null
      const date = new Date(timestamp * 1000);
      return date ? date.toLocaleString('ru-RU', {year: '2-digit', month: '2-digit', day: 'numeric'}) : null
    };
    const openBook = async (book, type) => {
      await router.push({
        name: type === 'edit' ? 'book-edit' : 'book-view',
        params: {id: book.id}
      })
    };
    const resetTable = () => {
      filter.genre = null
      filter.rating = null
      filter.ad = null
      getBooksAndReplace()
    };
    const updateFilterPage = (newFilter) => {
      if (newFilter?.genre) {
        filter.genre = newFilter.genre.id
      }
      if (newFilter?.rating) {
        filter.rating = newFilter.rating
      }
      filter.ad = newFilter.ad ? 1 : 0
      getBooksAndReplace()
    };
    const sortBy = (column) => {
      orderBy.asc = !orderBy.asc
      orderBy.name = column
      getBooksAndReplace();
    };
    const getThumbs = (book) => {
      return book.cover_url ? `${process.env.VUE_APP_API_URL}/${book.cover_url}` : '/img/book-cover.jpg'
    };
    const toPage = async(url) => {
      try {
        books.value = await goPage(url.href);
      } catch (e) {
        console.log({'goPage': e})
      }
    };

    const showFilterModal =() => {
      showModal.value = true
    };

    getBooksAndReplace();

    return {
      books,
      bookName,
      filter,
      showModal,
      page,
      pagBtnArr,
      limit,
      orderBy,
      main,
      modalSize,
      getBooksAndReplace,
      searchByName,
      getDate,
      openBook,
      resetTable,
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
      color: var(--text1);
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
