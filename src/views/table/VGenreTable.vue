<template>
  <div class="genre-table">
<!--    <teleport to="#aside" :disabled="isMobile()">
    <section class="sidebar">
      <button class="sidebar-btn btn-outline" @click="createGenre">create</button>
    </section>
    </teleport>-->
    <table class="table">
      <thead class="thead">
      <th class="th" :class="columnsClasses[column]" v-for="(column, index) of columns" :key="index">
        <div class="table-cell">
          <div class="td-title">{{ column }}</div>
          <button class="td-action" @click="sortBy(column, ascending)">
            <IconSortAsc class="icon" v-if="ascending"/>
            <IconSortDesc class="icon" v-else/>
          </button>
        </div>
      </th>
      </thead>
      <transition-group name="flip-list" tag="tbody">
        <tr class="row" :class="{picante: genre.ad}" v-for="(genre, index) of genres" :key="genre.id"
            @click="openRow(genre)" :tabindex="index + 1">
          <td class="td" :class="columnsClasses.id">{{ genre.id }}</td>
          <td class="td" :class="columnsClasses.title">{{ genre.name }}</td>
          <td class="td" :class="columnsClasses.description">{{ genre.description }}</td>
          <td class="td" :class="columnsClasses.category">{{ genre.category ? genre.category.name : '' }}</td>
        </tr>
      </transition-group>
    </table>
    <dialog ref="genreModal" class="dialog dialog-genre" @close="showGenreModal = false">
      <EditGenre v-if="showGenreModal" :genre="activeGenre" :categories="categories"  @update-genres="getGenres"
                 @hide-modal="closeDialog"/>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import useGenres from "../../composables/useGenres";
import EditGenre from '../../components/EditGenre.vue'
import IconSortAsc from '@/components/icons/IconSortAsc.vue'
import IconSortDesc from '@/components/icons/IconSortDesc.vue'
import {isMobile} from "../../utils/helpers";

document.title = 'Table Genres';
const columns: string[] = ['id', 'name', 'description', 'category']
const columnsClasses: {[index: string]:string} = {
  id: 'cell-id',
  name: 'cell-name',
  description: 'cell-description',
  category: 'cell-category'
}

interface CategoryExtended extends Category{
    genres?: Array<Genre>
}

interface Category {
  id: number,
  name: string,
}
interface Genre {
    id: number,
    name: string,
    description: string,
    category: Category,
    ad: boolean,
    created_at: number,
}
const props = defineProps<{
  categories: CategoryExtended[]
}>()


const {genres, ascending, genreModal, showGenreModal, closeDialog, activeGenre, openRow, createGenre, sortBy, getGenres} = useGenres()
if (genres.value?.length === 1 && genres.value[0].id === 0) {
  getGenres();
}
</script>

<style lang="scss">
.genre-table {
  width: 100%;
  padding: 0 1.5rem;

  .flip-list-move {
    transition: transform 1s;
  }

}
@media only screen and (min-width: 893px) {
  .genre-table {
    .dialog-genre {
      left: calc(50% - 175px);
      top: calc(50% - 200px);
    }
  }
}

@media only screen and (max-width: 892px) {
  .genre-table {
    padding: 0;
    height: calc(100% - 3.5rem);
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