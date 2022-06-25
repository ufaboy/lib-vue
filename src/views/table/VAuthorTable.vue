<template>
  <div class="authors-table">
    <table class="table">
      <thead class="thead">
      <th class="th" :class="columnsClasses[column]" v-for="(column, index) of columns" :key="index">
        <div class="flex flex-row justify-center">
          <div class="mr-2">{{ column }}</div>
          <button class="td-action" @click="sortBy(column)">
            <IconSort class="icon" :ascending="ascending"/>
          </button>
        </div>
      </th>
      </thead>
      <tbody>
        <tr class="row cursor-pointer" :class="{picante: author.ad}" v-for="(author, index) of authors" :key="author.id"
            @click="openRow(author)" :tabindex="index + 1">
          <td class="td" :class="columnsClasses.id">{{ author.id }}</td>
          <td class="td" :class="columnsClasses.name">{{ author.name }}</td>
          <td class="td" :class="columnsClasses.url">{{ author.url }}</td>
          <td class="td" :class="columnsClasses.ad">{{ author.ad }}</td>
        </tr>
      </tbody>
    </table>
    <teleport to="#sidebar-target" v-if="!isMobile() && isMounted">
      <hr class="my-3">
      <ul>
        <li class="hover:dark:bg-slate-700 mb-2 text-slate-900 dark:text-white cursor-pointer">
          <button class="capitalize flex w-full p-2" @click="createAuthor">create</button>
        </li>
      </ul>
    </teleport>
    <dialog ref="modalAuthor" class="dialog dark:bg-slate-800 rounded-lg w-72" @close="modalAuthorShow = false">
      <EditAuthor v-if="modalAuthorShow" @hide-modal="closeDialog" :author="activeAuthor" @update-authors="getAuthors" />
    </dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import useAuthors from '../../composables/useAuthors';
import {isMobile} from '../../utils/helpers';
import EditAuthor from '../../components/modals/EditAuthor.vue';
import IconSort from '../../components/icons/IconSort.vue'

document.title = 'Table Authors';
const columns: string[] = ['id', 'name', 'url', 'ad']
const columnsClasses: { [index: string]: string } = {
  id: 'cell-id',
  name: 'cell-name',
  url: 'cell-url',
  ad: 'cell-ad'
}

const {
  authors,
  getAuthors, modalAuthorShow, createAuthor, openRow, modalAuthor, activeAuthor,
  sortBy, ascending, orderBy, closeDialog
} = useAuthors()

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
getAuthors();
</script>

<style lang="scss">

</style>