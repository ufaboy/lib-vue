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
        <option v-for="category of categories" :key="category.id" :value="category">{{category.name}}</option>
      </select>
    </label>
    <footer class="footer">
      <button class="negative-btn" type="reset" @click="deleteGenre">Удалить</button>
      <button class="positive-btn">Сохранить</button>
    </footer>
  </form>
</template>

<script>
import {computed, inject, ref} from "vue";
import {useStore} from 'vuex'
import {$delete} from "@/utils/superFetch";
import IconClose from "@/components/icons/IconClose"
import {sendGenre} from "@/utils/uploadData";
import {getAdAccess} from "@/utils/userData";
export default {
  name: "EditGenre",
  components: {IconClose},
  emits: ['update-genres', 'hide-modal'],
  props: {
    genre: Object,
  },
  setup(props, {emit}) {
    const store = useStore()
    const localGenre = ref({})
    const adAccess = getAdAccess()
    const loader = inject("loader");
    localGenre.value = Object.assign({
      id: null,
      name: '',
      description: '',
      category: {id: null, name: ''},
      ad: null,
    }, props.genre)

    const invalidGenre = computed(() => {
      return {
        name: !localGenre.value.name,
        category: !localGenre.value.category
      }
    })
    const categories = computed(() => {
      return store.state.genre.categories.map(category => {
        return {id: category.id, name: category.name}
      })
    })

    const checkGenreToHaveErrors = () => {
      let haveErrors = false
      for (const field in invalidGenre) {
        if (invalidGenre.value[field]) {
          haveErrors = true
        }
      }
      return haveErrors
    }
    const updateGenre = async() => {
      if (checkGenreToHaveErrors()) {
        return false;
      }
      let genreForm = {
        name: localGenre.value.name,
        description: localGenre.value.description,
        ad: localGenre.value.ad,
        category_id: localGenre.value.category.id,
      }
      if (localGenre.value.id) {
        genreForm.id = localGenre.value.id
      }
      try {
        loader.show()
        await sendGenre(genreForm)
        loader.hide()
        emit('update-genres')
        closeModal();
      } catch (e) {
        console.log({'error updateGenre': e})
      }

    }
    const deleteGenre = async () => {
      const url = `/genre/delete?id=${props.genre.id}`
      const result = await $delete(url)
      if (result) {
        emit('update-genres')
        closeModal();
      }
    }
    const closeModal = () => {
      emit('hide-modal')
    }

    return {localGenre, closeModal, checkGenreToHaveErrors, updateGenre, deleteGenre, categories, adAccess}
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
