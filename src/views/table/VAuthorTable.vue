<template>
  <div class="authors-table">
    <teleport to="#sidebar" :disabled="isMobile()" v-if="isMounted">
      <hr class="my-3">
      <ul>
        <li>
          <button class="capitalize flex w-full p-3" @click="createAuthor">create</button>
        </li>
      </ul>
    </teleport>
    <table class="table">
      <thead class="thead">
      <th class="th" :class="columnsClasses[column]" v-for="(column, index) of columns" :key="index">
        <div class="table-cell">
          <div class="td-title">{{ column }}</div>
          <button class="td-action" @click="sortBy(column)">
            <IconSortAsc class="icon" v-if="ascending"/>
            <IconSortDesc class="icon" v-else/>
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
    <dialog ref="modalAuthor" class="dialog dark:bg-slate-700 rounded-lg w-72" @close="modalAuthorShow = false">
      <EditAuthor v-if="modalAuthorShow" @hide-modal="closeDialog" :author="activeAuthor" @update-authors="getAuthors" />
    </dialog>
  </div>
</template>

<script setup lang="ts">

import IconSortAsc from '@/components/icons/IconSortAsc.vue'
import IconSortDesc from '@/components/icons/IconSortDesc.vue'
import {isMobile} from "../../utils/helpers";
import useAuthors from "../../composables/useAuthors";
import EditAuthor from "../../components/EditAuthor.vue";
import {onMounted, ref} from "vue";

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
.authors-table {
  width: 100%;
  padding: 0 1.5rem;

  .flip-list-move {
    transition: transform 1s;
  }

}

@media only screen and (min-width: 893px) {
  .authors-table {
  }
}

@media only screen and (max-width: 892px) {
  .authors-table {
    padding: 0;
    height: calc(100% - 3.5rem);
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {
  .authors-table {
    .table {
      .cell-id {
        display: none;
      }
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {
  .authors-table {
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