<template>
  <form class="edit-genre" @submit.prevent="updateGenre">
    <header class="header">
      <h1>Genre</h1>
        <button v-if="adAccess"
                type="button"
                class="btn-switch btn"
                :class="{'active': localGenre.ad}"
                @click="localGenre.ad = !localGenre.ad">ad
        </button>
      <button class="close-btn" type="reset" @click="closeModal">
        <base-icon class="icon" icon-name="close"><icon-close/></base-icon>
      </button>
    </header>
    <label class="label">
      <span class="title">name</span>
      <input type="text" class="value" v-model.trim="localGenre.name" v-focus>
    </label>
    <label class="label">
      <span class="title">description</span>
      <textarea class="value textarea" v-model.trim="localGenre.description" rows="5"></textarea>
    </label>
    <label class="label">
      <span class="title">category</span>
      <select class="select value" v-model="localGenre.category">
        <option v-for="category of categoriesSimple" :key="category.id" :value="category">{{category.name}}</option>
      </select>
    </label>
    <footer class="footer">
      <button class="negative-btn" type="reset" @click="deleteGenre">Удалить</button>
      <button class="positive-btn">Сохранить</button>
    </footer>
  </form>
</template>

<script>

import IconClose from "@/components/icons/IconClose"
import useGenre from "@/composables/useGenre";
import {toRefs} from "vue";
export default {
  name: "EditGenre",
  components: {IconClose},
  emits: ['update-genres', 'hide-modal'],
  props: {
    genre: Object,
    categories: Array,
  },
  setup(props, {emit}) {
    const {categories} = toRefs(props)
    const {localGenre, closeModal, checkGenreToHaveErrors, updateGenre, deleteGenre, adAccess} = useGenre(props, emit)
    const categoriesSimple = categories.value.map(category=>{
      return {id: category.id, name: category.name}
    })
    return {categoriesSimple, localGenre, closeModal, checkGenreToHaveErrors, updateGenre, deleteGenre, adAccess};
  },
}
</script>

<style lang="scss" scoped>
.edit-genre {
  padding: 1rem;
  display: flex;
  flex-flow: wrap;
  height: 100%;
  width: 100%;
  color: var(--text1);
  .header {
    margin-bottom: 1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
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
