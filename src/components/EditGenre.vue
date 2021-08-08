<template v-slot:default="dataProps">
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
import IconClose from "@/components/icons/IconClose"
import {sendGenre} from "@/utils/uploadData";
import {adAccess} from "@/utils/userData";
export default {
  name: "EditGenre",
  components: {IconClose},
  emits: ['update-genres'],
  props: {
    genre: Object,
    dataProps: Object,
  },
  data: () => ({
    localGenre: {
      id: null,
      name: '',
      description: '',
      category: {id: null, name: ''},
      ad: null,
    },
  }),
  computed: {
    invalidGenre() {
      return {
        name: !this.localGenre.name,
        category: !this.localGenre.category
      }
    },
    adAccess() {
      return adAccess()
    },
    categories() {
      return this.$store.state.genre.categories.map(category => {
        return {id: category.id, name: category.name}
      })
    },
  },
  watch: {},
  created() {
    this.prepareGenre()
  },
  mounted() {
  },
  methods: {
    async updateGenre() {
      if (this.checkGenreToHaveErrors()) {
        return false;
      }
      let genreForm = {
        name: this.localGenre.name,
        description: this.localGenre.description,
        ad: this.localGenre.ad,
        category_id: this.localGenre.category.id,
      }
      if (this.localGenre.id) {
        genreForm.id = this.localGenre.id
      }
      try {
        await sendGenre(genreForm)
        this.$emit('update-genres')
        this.closeModal();
      } catch (e) {
        console.log({'error updateGenre': e})
      }

    },
    async deleteGenre() {
      if (!this.genre.parent_id) {
        return false;
      }
      const url = `/genre/delete?id=${this.genre.id}`
      const result = await this.$delete(url)
      if (result) {
        this.$store.dispatch('genre/loadGenre')
        this.closeModal();
      }
    },
    selectGenre(genre) {
      this.parent = genre
    },
    clearGenre() {
      this.parent = {id: null, name: null}
    },
    closeModal() {
      this.$parent.hide('editGenre', this)
    },
    checkGenreToHaveErrors() {
      let haveErrors = false
      for (const field in this.invalidGenre) {
        if (this.invalidGenre[field]) {
          haveErrors = true
          this.$toast.error(`invalid field: ${field}`)
        }
      }
      return haveErrors
    },
    prepareGenre() {
      this.localGenre = Object.assign({}, this.genre)
    },
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
