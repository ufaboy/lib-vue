<template>
  <form class="flex flex-col text-slate-900 dark:text-white" @submit.prevent="updateGenre" method="dialog">
    <header class="flex flex-row items-center justify-between mb-3">
      <h1>Genre</h1>
      <button class="close-btn" type="reset" @click="closeModal">
        <IconClose class="icon" />
      </button>
    </header>
    <div class="flex flex-col mb-2">
      <label class="mb-1">name</label>
      <input type="text" class="input-text" required v-model.trim="localGenre.name">
    </div>
    <div class="flex flex-col mb-2">
      <label class="mb-1">description</label>
      <textarea class="textarea" v-model.trim="localGenre.description" rows="3"></textarea>
    </div>
    <section class="flex flex-row items-center justify-between">
      <div class="flex flex-col">
        <label class="mb-1">category</label>
        <select class="select" required v-model="localGenre.category">
          <option v-for="category of categoriesSimple" :key="category.id" :value="category">{{ category.name }}</option>
        </select>
      </div>
      <div class="flex flex-col ad">
        <label class="mb-1">ad</label>
        <ToggleAd v-model="localGenre.ad" />
      </div>
    </section>
    <footer class="flex flex-row items-center justify-between mt-3">
      <button class="btn-red" type="reset" @click="deleteGenre">Удалить</button>
      <button class="btn-green">Сохранить</button>
    </footer>
  </form>
</template>

<script setup lang="ts">
import IconClose from "@/components/icons/IconClose.vue"
import useGenre from "../../composables/useGenre";
import { GenreForm } from "../../interfaces/genre";
import {getAdAccess} from "../../utils/userData";
import ToggleAd from "../ToggleAd.vue";

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
  categories: CategoryExtended[],
  genre: GenreForm,
}>()

const emit = defineEmits(['update-genres', 'hide-modal'])

const adAccess = getAdAccess()
const {localGenre, closeModal, updateGenre, deleteGenre} = useGenre(props, emit)
const categoriesSimple = props.categories.map(category => {
  return {id: category.id, name: category.name}
})
</script>

<style lang="scss">
</style>
