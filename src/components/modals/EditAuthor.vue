<template>
  <form method="dialog" class="flex flex-col text-slate-900 dark:text-white" @submit.prevent="updateAuthor">
    <header class="header flex flex-row items-center justify-between mb-2">
      <h1>Author</h1>
      <button class="close-btn" type="reset" @click="closeModal">
        <IconClose class="icon text-inherit" />
      </button>
    </header>
    <div class="flex flex-col">
      <label class="mb-1">name</label>
      <input type="text" class="input-text" required v-model.trim="editableAuthor.name">
    </div>
    <div class="flex flex-col">
      <label class="mb-1">url</label>
      <input type="text" class="input-text" required v-model.trim="editableAuthor.url">
    </div>
    <footer class="flex flex-row items-center justify-between mt-3">
      <button class="btn-red" type="reset" @click="deleteAuthor">Удалить</button>
      <button class="btn-green">Сохранить</button>
    </footer>
  </form>
</template>

<script setup lang="ts">
import IconClose from "@/components/icons/IconClose.vue";
import useAuthor from "../../composables/useAuthor";
import {Author} from "../../interfaces/author";

const props = defineProps<{
  author: Author,
}>()
const emit = defineEmits(['update-authors', 'hide-modal'])
const {editableAuthor, closeModal, updateAuthor, deleteAuthor} = useAuthor(props, emit)
</script>