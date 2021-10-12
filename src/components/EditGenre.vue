<template>
  <form class="edit-genre" @submit.prevent="updateGenre">
    <header class="header">
      <h1>Genre</h1>
      <!--        <button v-if="adAccess"-->
      <!--                type="button"-->
      <!--                class="btn-switch btn"-->
      <!--                :class="{'active': localGenre.ad}"-->
      <!--                @click="localGenre.ad = !localGenre.ad">ad-->
      <!--        </button>-->
      <button class="close-btn" type="reset" @click="closeModal">
        <base-icon class="icon" icon-name="close">
          <icon-close/>
        </base-icon>
      </button>
    </header>
    <div class="form-field mb-1">
      <label class="form-field__label">name</label>
      <input type="text" class="form-field__input" v-model.trim="localGenre.name">
    </div>
    <div class="form-field mb-1">
      <label class="form-field__label">description</label>
      <textarea class="form-field__textarea" v-model.trim="localGenre.description" rows="3"></textarea>
    </div>
    <section class="form-row mb-1">
      <div class="form-field">
        <label class="form-field__label">category</label>
        <select class="select form-field__select" v-model="localGenre.category">
          <option v-for="category of categoriesSimple" :key="category.id" :value="category">{{ category.name }}</option>
        </select>
      </div>
      <div class="form-field">
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

<script setup>
import IconClose from "@/components/icons/IconClose"
import useGenre from "@/composables/useGenre";
import {getAdAccess} from "../utils/userData";
// eslint-disable-next-line no-undef,no-unused-vars
const props = defineProps({
  categories: Array,
  genre: Object,
})
// eslint-disable-next-line no-undef
const emit = defineEmits(['update-genres', 'hide-modal'])

const adAccess = getAdAccess()
const {localGenre, closeModal, updateGenre, deleteGenre} = useGenre(props, emit)
const categoriesSimple = props.categories.map(category => {
  return {id: category.id, name: category.name}
})
</script>

<style lang="scss" scoped>
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

  .form-field {

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
