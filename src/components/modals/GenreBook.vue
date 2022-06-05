<template>
  <form class="w-auto"
        @submit.prevent="sendGenre" method="dialog">
    <header class="flex flex-row justify-between">
      <h1>Genre</h1>
      <span>selected: {{ selectedGenre.length }}</span>
      <button class="close-btn dark:text-white" type="reset" @click="closeModal">
        <IconClose class="icon" />
      </button>
    </header>
    <div class="mt-2">
      <span v-if="selectedGenre.length === 0">Не выбраны жанры</span>
      <span class="mr-1" :style="{color: colorizeGenre(index)}" v-for="(genre, index) of selectedGenre"
            :key="genre.id">{{ genre.name }}</span>
    </div>
    <fieldset class="flex flex-row flex-nowrap border p-2" v-if="!isMobile()">
      <legend>all genres</legend>
      <div class="flex flex-col mr-1 mb-1" :class="{'checked-childes': calcCheckedChildes(category)}" v-for="category of categories"
           :key="category.id" @click="activeCategory = Number(category.id)">
        <div class="parent-title">{{ category.name }}</div>
        <label class="checkbox-container" v-for="genre of category.genres" :key="genre.id">{{ genre.name }}
          <input type="checkbox" :value="genre" v-model="selectedGenre">
          <span class="checkmark"></span>
        </label>
      </div>
    </fieldset>
<!--    <select class="select" v-model="selectedGenre" v-if="isMobile()" multiple>-->
<!--      <optgroup :label="category.name" v-for="category of categories" :key="'category-' + category.id">-->
<!--        <option v-for="genre of category.genres"-->
<!--                :key="'select-genre'+genre.id"-->
<!--                :value="genre">{{ genre.name }}-->
<!--        </option>-->
<!--      </optgroup>-->
<!--    </select>-->
    <footer class="mt-2 flex flex-row justify-around">
      <button class="btn-gray" type="button" @click="reset">Сброс</button>
      <button class="btn-green">Сохранить</button>
    </footer>
  </form>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {isMobile} from "../../utils/helpers";
import IconClose from "@/components/icons/IconClose.vue"
import { CategoryExtended } from '../../interfaces/category';

// eslint-disable-next-line no-undef
const emit = defineEmits(['set-genres', 'hide-modal'])


interface Category {
    id: number,
    name: string,
    genres: Array<Genre>
}
interface Genre {
    id: number,
    name: string,
    description: string,
    category: Category,
    ad: number,
    created_at: number,
}
const props = defineProps<{
  categories: Category[],
  genresProps: Genre[],
}>()


const activeCategory = ref(0);
const selectedGenre = ref<Genre[]>([]);
const genres = ref<Genre[]>([]);

if (props.genresProps && props.genresProps.length) {
  selectedGenre.value.push(...props.genresProps)
}


function sendGenre() {
  emit('set-genres', selectedGenre)
}

function calcCheckedChildes(e:Category) {
  return e.genres.find(item => genres.value.map(genre => genre.id).includes(item.id))
}

function colorizeGenre(i:number) {
  const color = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'DeepSkyBlue', 'PURPLE',]
  return color[i]
}

function reset() {
  // selectedGenre.value = props.genresProps.map(a => ({...a}))
  selectedGenre.value.splice(0, selectedGenre.value.length)
}

function closeModal() {
  emit('hide-modal')
}
</script>
