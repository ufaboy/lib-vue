<template>
  <div class="genre-table">
    <header class="header">
      <button class="btn" @click="createGenre">create</button>
    </header>
    <table class="table">
      <thead class="thead">
      <th class="th" :class="$options.columnsClasses[column]" v-for="(column, index) of $options.columns" :key="index">
        <div class="table-cell">
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
      <transition-group name="flip-list" tag="tbody">
        <tr class="row" :class="{picante: genre.ad}" v-for="genre of genres" :key="genre.id"
            @click="openRow(genre)">
          <td class="td" :class="$options.columnsClasses.id">{{ genre.id }}</td>
          <td class="td" :class="$options.columnsClasses.title">{{ genre.name }}</td>
          <td class="td" :class="$options.columnsClasses.description">{{ genre.description }}</td>
          <td class="td" :class="$options.columnsClasses.category">{{ genre.category ? genre.category.name : '' }}</td>
        </tr>
      </transition-group>
    </table>
    <the-modal v-if="showModal" @hide-modal="showModal = false">
      <edit-genre :genre="activeGenre" @update-genres="getGenres" @hide-modal="showModal = false" />
    </the-modal>
  </div>
</template>

<script>
import {ref, reactive} from "vue";
import {loadGenres} from "@/utils/loadData";
import EditGenre from '@/components/EditGenre.vue'
import IconSortAsc from '@/components/icons/IconSortAsc.vue'
import IconSortDesc from '@/components/icons/IconSortDesc.vue'
import TheModal from "@/components/TheModal";

export default {
  name: "GenreTable",
  components: {TheModal, EditGenre, IconSortAsc, IconSortDesc},
  props: {},
  setup() {
    document.title = 'Table Genres';
    const genres = ref([]);
    const ascending = ref(1);
    const orderBy = ref(null);
    const showModal = ref(false);
    const activeGenre = reactive({
      id: null,
      name: null,
      description: null,
      category: {id: null, name: null},
    });

    const getGenres = async () => {
      const result = ref({})
      result.value = await loadGenres()
      if (result.value) {
        genres.value = result.value
      } else console.log({'getGenres': result.value})
    };
    if (genres.value.length === 0) {
      getGenres();
    }
    const sortBy = (orderBy, asc) => {
      genres.value.sort(function (a, b) {
        if (a[orderBy] > b[orderBy]) {
          return asc ? 1 : -1;
        }
        if (a[orderBy] < b[orderBy]) {
          return asc ? -1 : 1;
        }
        return 0;
      })
      ascending.value = ascending.value ? 0 : 1
    }
   const openRow = (row) => {
      activeGenre.value = row
      showModal.value = true
    }
    const createGenre = () => {
      activeGenre.value = reactive({
        id: null,
        name: null,
        description: null,
        category: {id: null, name: null},
      });
      showModal.value = true
    }

    return {getGenres, genres, ascending, orderBy, activeGenre, sortBy, showModal, openRow, createGenre}
  },
  data: () => ({}),
  columns: ['id', 'name', 'description', 'category'],
  columnsClasses: {
    id: 'cell-id',
    name: 'cell-name',
    description: 'cell-description',
    category: 'cell-category'
  },
  methods: {},
}
</script>

<style scoped lang="scss">
.genre-table {
  width: 100%;
  height: calc(100% - 3.5rem);
  padding: 1rem 1.5rem;

  .header {
    margin-bottom: 0.5rem;
    display: flex;
    flex-flow: row nowrap;

    .btn {
      display: flex;
      //flex: 1;
      align-items: center;
      justify-content: center;
      text-transform: capitalize;
    }

    .btn:last-of-type {
      margin-right: 0;
    }
  }

  .flip-list-move {
    transition: transform 1s;
  }
}

@media only screen and (max-width: 892px) {
  .genre-table {
    padding: 0.5rem;

    .dialog {
      margin: auto;
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {
  .genre-table {
    .table {
      .cell-id {
        display: none;
      }
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {
  .genre-table {
    .dialog {
      width: 100%;
      margin: auto;
    }

    .table {
      .cell-description, .cell-id {
        display: none;
      }
    }
  }
}
</style>