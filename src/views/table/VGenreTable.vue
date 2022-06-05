<template>
  <div class="genre-table flex overflow-x-hidden overflow-y-auto justify-center">
    <table class="table w-full">
      <thead class="thead sticky top-0">
      <th class="th py-2" v-for="(column, index) of columns" :key="index">
        <div class="table-cell flex flex-row flex-nowrap">
          <div class="td-title">{{ column }}</div>
          <button class="td-action" @click="sortBy(column, ascending)">
            <IconSortAsc class="icon" v-if="ascending"/>
            <IconSortDesc class="icon" v-else/>
          </button>
        </div>
      </th>
      </thead>
      <transition-group name="flip-list" tag="tbody">
        <tr class="row cursor-pointer" :class="{picante: genre.ad}" v-for="(genre, index) of genres" :key="genre.id"
            @click="openRow(genre)" :tabindex="index + 1">
          <td class="td" >{{ genre.id }}</td>
          <td class="td" >{{ genre.name }}</td>
          <td class="td" >{{ genre.description }}</td>
          <td class="td" >{{ genre.category ? genre.category.name : '' }}</td>
        </tr>
      </transition-group>
    </table>
    <teleport to="#sidebar" :disabled="isMobile()" v-if="isMounted">
      <hr class="my-3">
      <ul>
        <li>
          <button class="capitalize flex w-full p-3" @click="createGenre">create</button>
        </li>
      </ul>
    </teleport>

    <dialog ref="genreModal" class="dialog dark:bg-slate-800 rounded-lg w-72" @close="showGenreModal = false">
      <EditGenre v-if="showGenreModal" :genre="activeGenre" :categories="categories"  @update-genres="getGenres"
                 @hide-modal="closeDialog"/>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import useGenres from "../../composables/useGenres";
import EditGenre from '../../components/modals/EditGenre.vue'
import IconSortAsc from '@/components/icons/IconSortAsc.vue'
import IconSortDesc from '@/components/icons/IconSortDesc.vue'
import {isMobile} from "../../utils/helpers";
import {onMounted, ref} from "vue";

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
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

const {genres, ascending, genreModal, showGenreModal, closeDialog, activeGenre, openRow, createGenre, sortBy, getGenres} = useGenres()
if (genres.value?.length === 1 && genres.value[0].id === 0) {
  getGenres();
}
</script>

<style lang="scss">
.genre-table {
  .flip-list-move {
    transition: transform 1s;
  }

}
@media only screen and (min-width: 893px) {
  .genre-table {}
}

@media only screen and (max-width: 892px) {
  .genre-table {}
}
@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {
  .genre-table {}
}
@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {
  .genre-table {}
}
</style>