<template>
  <form class="edit-genre" @submit.prevent="updateGenre" method="dialog">
    <header class="header">
      <h1>Genre</h1>
      <button class="close-btn" type="reset" @click="closeModal">
        <IconClose class="icon" />
      </button>
    </header>
    <div class="form-field mb-1">
      <label class="form-field__label">name</label>
      <input type="text" class="form-field__input" required v-model.trim="localGenre.name">
    </div>
    <div class="form-field mb-1">
      <label class="form-field__label">description</label>
      <textarea class="form-field__textarea" v-model.trim="localGenre.description" rows="3"></textarea>
    </div>
    <section class="form-row mb-1">
      <div class="form-field">
        <label class="form-field__label">category</label>
        <select class="select form-field__select" required v-model="localGenre.category">
          <option v-for="category of categoriesSimple" :key="category.id" :value="category">{{ category.name }}</option>
        </select>
      </div>
      <div class="form-field ad">
        <label class="form-field__label">ad</label>
        <div class="toggle toggle--knob" v-if="adAccess">
          <input type="checkbox" id="toggle--knob" class="toggle--checkbox" v-model="localGenre.ad">
          <label class="toggle--btn" for="toggle--knob">
            <span class="toggle--feature" data-label-on="on" data-label-off="off"></span>
          </label>
        </div>
      </div>
    </section>

    <footer class="footer">
      <button class="negative-btn" type="reset" @click="deleteGenre">Удалить</button>
      <button class="positive-btn">Сохранить</button>
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
.edit-genre {
  padding: 1rem;
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  width: 100%;
  color: var(--text);

  .header {
    margin-bottom: 1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .btn-switch {
    font-weight: bold;
  }

  .btn-switch.active {
    color: red;
  }

  .form-field.ad {
    .form-field__label {
      justify-content: center;
    }
    .toggle {
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }

  .footer {
    display: flex;
    width: 100%;
    justify-content: space-between;

    button:last-of-type {
      margin-right: 0;
    }
  }

}

</style>
