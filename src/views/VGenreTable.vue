<template>
  <div class="genre-table">
    <header class="header">
      <button class="btn-outline" @click="createGenre">create</button>
    </header>
    <table class="table">
      <thead class="thead">
      <th class="th" :class="columnsClasses[column]" v-for="(column, index) of columns" :key="index">
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
          <td class="td" :class="columnsClasses.id">{{ genre.id }}</td>
          <td class="td" :class="columnsClasses.title">{{ genre.name }}</td>
          <td class="td" :class="columnsClasses.description">{{ genre.description }}</td>
          <td class="td" :class="columnsClasses.category">{{ genre.category ? genre.category.name : '' }}</td>
        </tr>
      </transition-group>
    </table>
    <the-modal v-if="showModal" :width="400">
      <edit-genre :genre="activeGenre" :categories="categories" @update-genres="getGenres"
                  @hide-modal="showModal = false"/>
    </the-modal>
  </div>
</template>

<script setup>
import useGenres from "@/composables/useGenres";
import EditGenre from '@/components/EditGenre.vue'
import TheModal from "@/components/TheModal";
import IconSortAsc from '@/components/icons/IconSortAsc.vue'
import IconSortDesc from '@/components/icons/IconSortDesc.vue'

document.title = 'Table Genres';
const columns = ['id', 'name', 'description', 'category']
const columnsClasses = {
  id: 'cell-id',
  name: 'cell-name',
  description: 'cell-description',
  category: 'cell-category'
}
// eslint-disable-next-line no-undef,no-unused-vars
const props = defineProps({
  categories: Array,
})

const {genres, ascending, showModal, activeGenre, openRow, createGenre, sortBy, getGenres} = useGenres()

if (genres.value.length === 0) {
  getGenres();
}
</script>

<style scoped lang="scss">
.genre-table {
  width: 100%;
  height: calc(100% - 3.5rem);
  padding: 0.5rem 1.5rem;

  .header {
    margin-bottom: 0.5rem;
    display: flex;
    flex-flow: row nowrap;

    .btn {
      display: flex;
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