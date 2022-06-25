<template>
  <div class="flex overflow-x-hidden overflow-y-auto justify-center">
    <table class="table w-full">
      <thead class="thead sticky top-0">
      <th class="th py-2" v-for="(column, index) of columns" :key="index">
        <div class="flex flex-row flex-nowrap justify-center">
          <div class="mr-2">{{ column }}</div>
          <button class="td-action" @click="sortBy(column, ascending)">
            <IconSort class="icon" :ascending="ascending"/>
          </button>
        </div>
      </th>
      </thead>
      <transition-group name="flip-list" tag="tbody">
        <tr class="row cursor-pointer hover:bg-sky-300 hover:dark:bg-slate-700 border-b border-black dark:border-white" :class="{picante: genre.ad}" v-for="(genre, index) of genres" :key="genre.id"
            @click="openRow(genre)" :tabindex="index + 1">
          <td class="p-2">{{ genre.id }}</td>
          <td class="p-2">{{ genre.name }}</td>
          <td class="p-2">{{ genre.description }}</td>
          <td class="p-2">{{ genre.category ? genre.category.name : '' }}</td>
        </tr>
      </transition-group>
    </table>
    <teleport to="#sidebar-target" v-if="!isMobile() && isMounted">
      <hr class="my-3">
      <ul>
        <li class="hover:dark:bg-slate-700 mb-2 text-slate-900 dark:text-white cursor-pointer">
          <button class="flex w-full py-1 px-2" @click="createGenre">Create</button>
        </li>
      </ul>
    </teleport>

    <dialog ref="genreModal"
            class="dialog bg-neutral-300 dark:bg-slate-800 text-slate-800 dark:text-white shadow-md rounded-lg w-72"
            @close="showGenreModal = false">
      <EditGenre v-if="showGenreModal" :genre="activeGenre" :categories="categories"  @update-genres="getGenres"
                 @hide-modal="closeDialog"/>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import useGenres from "../../composables/useGenres";
import EditGenre from '../../components/modals/EditGenre.vue'
import IconSort from '@/components/icons/IconSort.vue'
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
</style>