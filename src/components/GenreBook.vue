<template>
  <form class="genre-book" @submit.prevent="sendGenre">
    <header class="modal-header">
      <h1>Genre</h1>
      <span>{{ genres.length }}</span>
      <button class="close-btn" type="reset" @click="closeModal">
        <base-icon class="icon" icon-name="close">
          <icon-close/>
        </base-icon>
      </button>
    </header>
    <div class="form-field">
      <label class="form-field__label">selected: {{ selectedGenre.length }}</label>
      <span v-if="selectedGenre.length === 0">Не выбраны жанры</span>
      <span class="fieldset-genre" :style="{color: colorizeGenre(index)}" v-for="(genre, index) of selectedGenre"
            :key="genre.id">{{ genre.name }}</span>
    </div>
    <fieldset class="genres" v-if="isDesktop">
      <legend>all genres</legend>
      <div class="parent" :class="{'checked-childes': calcCheckedChildes(category)}" v-for="category of categories"
           :key="category.id" @click="activeCategory = Number(category.id)">
        <div class="parent-title">{{ category.name }}</div>
        <label class="checkbox-container" v-for="genre of category.genres" :key="genre.id">{{ genre.name }}
          <input type="checkbox" :value="genre" v-model="selectedGenre">
          <span class="checkmark"></span>
        </label>
      </div>
    </fieldset>
    <select class="select" v-model="selectedGenre" v-if="isMobile" multiple>
      <optgroup :label="category.name" v-for="category of categories" :key="'category-' + category.id">
        <option v-for="genre of category.genres"
                :key="'select-genre'+genre.id"
                :value="genre">{{ genre.name }}
        </option>
      </optgroup>
    </select>
    <footer class="footer">
      <button class="negative-btn" type="button" @click="reset">сброс</button>
      <button class="positive-btn">Сохранить</button>
    </footer>
  </form>
</template>

<script setup>
import {ref} from 'vue';
import useDevice from "@/composables/useDevice";
import IconClose from "@/components/icons/IconClose"

// eslint-disable-next-line no-undef
const emit = defineEmits(['set-genres', 'hide-modal'])
// eslint-disable-next-line no-undef,no-unused-vars
const props = defineProps({
  genresProps: Array,
  categories: Array,
})

const activeCategory = ref('');
const selectedGenre = ref([]);
const genres = ref([]);
const {isMobile, isDesktop} = useDevice();

if (props.genresProps && props.genresProps.length) {
  selectedGenre.value.push(...props.genresProps)
}

function sendGenre() {
  emit('set-genres', selectedGenre)
}

function calcCheckedChildes(e) {
  return e.genres.find(item => genres.value.map(genre => genre.id).includes(item.id))
}

function colorizeGenre(i) {
  const color = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'DeepSkyBlue', 'PURPLE',]
  return color[i]
}

function reset() {
  selectedGenre.value = props.genresProps.map(a => ({...a}))
}

function closeModal() {
  emit('hide-modal')
}

reset()
</script>

<style lang="scss" scoped>
.genre-book {
  display: flex;
  flex-flow: row wrap;
  padding: 1rem;
  height: 100%;
  width: 100%;
  color: var(--surface-on);
  background-color: var(--surface);
  border-radius: 10px;

  .modal-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-bottom: 1rem;
    width: 100%;
  }

  .search-field {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .genre-titles {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
  }

  .fieldset-genre {
    margin-right: 5px;
  }

  .genres {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    padding: 0.5rem;
  }

  .parent {
    cursor: pointer;
    margin: 0 0.5rem 0.5rem 0;
    width: 25%;

    .parent-title {
      text-transform: capitalize;
      margin-bottom: 0.5rem;
    }
  }

  .parent.checked-childes {
    .parent-title {
      color: var(--color-p);
    }

  }

  .parent:last-of-type {
    margin: 0 0 0.5rem 0;
  }

  .checkbox-container {
    margin-bottom: 0.5rem;
    text-overflow: ellipsis;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;

    .checkmark {

    }

    //.checkmark:after {
    //  left: 6px;
    //  top: 2px;
    //  width: 7px;
    //  height: 11px;
    //}
  }

  .select-genre {
    width: 100%;
    margin-bottom: 1rem;
  }

  .footer {
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
    width: 100%;
  }

  button {
    display: flex;
    align-items: center;
  }

}

@media only screen and (max-width: 892px) {
  .select {
    width: 100%;
  }
}

@media only screen and (min-width: 412px) and (max-width: 892px) and (orientation: landscape) {
  .genre-book {
  }
}

@media only screen and (min-width: 412px) and (max-width: 892px) and (orientation: portrait) {
  .genre-book {
  }
}
</style>
