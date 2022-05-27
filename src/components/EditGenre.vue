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
      <input type="text" class="p-2" required v-model.trim="localGenre.name">
    </div>
    <div class="flex flex-col mb-2">
      <label class="mb-1">description</label>
      <textarea class="p-2" v-model.trim="localGenre.description" rows="3"></textarea>
    </div>
    <section class="flex flex-row items-center justify-between">
      <div class="flex flex-col">
        <label class="mb-1">category</label>
        <select class="select p-2" required v-model="localGenre.category">
          <option v-for="category of categoriesSimple" :key="category.id" :value="category">{{ category.name }}</option>
        </select>
      </div>
      <div class="flex flex-col ad">
        <label class="mb-1">ad</label>
        <div class="toggle toggle--knob" v-if="adAccess">
          <input type="checkbox" id="toggle--knob" class="toggle--checkbox" v-model="localGenre.ad">
          <label class="toggle--btn" for="toggle--knob">
            <span class="toggle--feature" data-label-on="on" data-label-off="off"></span>
          </label>
        </div>
      </div>
    </section>

    <footer class="flex flex-row items-center justify-between mt-3">
      <button class="p-2 border rounded-md border-red-700 text-red-700" type="reset" @click="deleteGenre">Удалить</button>
      <button class="p-2 border rounded-md border-green-700 text-green-700">Сохранить</button>
    </footer>
  </form>
</template>

<script setup lang="ts">
import IconClose from "@/components/icons/IconClose.vue"
import useGenre from "../composables/useGenre";
import { GenreForm } from "../interfaces/genre";
import {getAdAccess} from "../utils/userData";

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
