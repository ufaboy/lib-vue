<template v-slot:default="dataProps">
  <form class="edit-genre" @submit.prevent="sendGenre">
    <header class="header">
      <h1>Genre</h1>
        <button v-if="username === 'admin'"
                type="button"
                class="btn-switch btn"
                :class="{'active': genre.ad}"
                @click="localGenre.genre.ad = !genre.ad">ad
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
      <span class="title">parent genre</span>
      <select class="select value" v-model="localGenre.parent_id">
        <option v-for="genre of $store.state.genre.items" :key="genre.id" :value="genre.id">{{genre.name}}</option>
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
      title: null,
      description: null,
      parent_id: null,
      ad: null,
    },
  }),
  computed: {
    username() {
      return this.$store.state.user.username
    }
  },
  watch: {},
  created() {
    this.prepareGenre()
    if (this.$store.state.genre.items.length === 0) {
      this.$store.dispatch('genre/loadGenres')
    }
  },
  mounted() {
  },
  methods: {
    async sendGenre() {
      if (!this.localGenre.name) {
        this.$toast.error('name not specified')
        return;
      }
      let result, url = `/genre/create`;
      const formData = {
        name: this.localGenre.name,
        description: this.localGenre.description,
        ad: this.localGenre.ad,
      }
      if (this.localGenre.parent_id) {
        formData.parent_id = this.localGenre.parent_id
      }
       if (this.localGenre.id) {
        url = `/genre/update?id=${this.genre.id}`
        result = await this.$patch(url, formData)
      } else {
        result = await this.$post(url, formData)
      }
      if (result) {

        this.$emit('update-genres')
        this.closeModal();
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
    prepareGenre() {
      this.localGenre = Object.assign({}, this.genre)
    },
  },
}
</script>

<style lang="scss">
.edit-genre {
  padding: 1rem;
  display: flex;
  flex-flow: wrap;
  height: 100%;
  width: 100%;
  color: var(--text2);
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
