<template>
  <div class="basement">
    <header class="header">
      <ul class="breadcrumb">
        <li class="breadcrumb-li">
          <router-link class="breadcrumb-link" to="/">Home</router-link>
        </li>
        <li class="breadcrumb-li" v-if="listParentTitle"><router-link class="breadcrumb-link" :to="{ name: 'list-genre', params: { id: $route.params.id }}">{{listParentTitle}}</router-link></li>
        <li class="breadcrumb-li" v-if="listGenreTitle"><router-link class="breadcrumb-link" :to="{ name: 'list-book', params: { id: $route.params.id }}" >{{listGenreTitle}}</router-link></li>

      </ul>
      <ul class="breadcrumb">
        <li class="breadcrumb-li">
          <router-link class="breadcrumb-link" to="/book">Books</router-link>
        </li>
        <li class="breadcrumb-li">
          <router-link class="breadcrumb-link" to="/genre">Genre</router-link>
        </li>
        <li class="breadcrumb-li">
          <router-link class="breadcrumb-link" to="/note">Note</router-link>
        </li>
        <li class="breadcrumb-li">
          <router-link class="breadcrumb-link" to="/settings">Settings</router-link>
        </li>
      </ul>
    </header>
    <slot/>
  </div>
</template>

<script>
export default {
  name: "LayoutDefault",
  components: {},
  props: {},
  data: () => ({}),
  methods: {
    async loadParents() {
      if (this.genresParent && this.genresParent.length === 0 && sessionStorage.getItem('lib-token')) {
        await this.$store.dispatch('genre/loadGenres')
      }
    },
  },
  computed: {
    listParentTitle() {
      if (this.$store.state.main.isMobile) {
        return false
      } else if (this.$route.name === 'list-genre' && this.$route.params.id) {
        const parent = this.genresParent.find(item => item.id === +this.$route.params.id)
        return parent.name
      } else if (this.$route.name === 'list-book' && this.$route.params.id) {
        return this.$route.params.parent
      } else return null
    },
    listGenreTitle() {
      if (this.$store.state.main.isMobile) {
        return false
      } else if (this.$route.name === 'list-book' && this.$route.params.id) {
        return this.$route.params.name
      } else return null
    },
    bookTitle() {
      if (this.$route.name === 'book-view' && this.$route.params.id) {
        return this.$route.params.name
      } else return null
    },
    genresParent() {
      return this.$store.state.genre.items
    }
  },
  watch: {},
  async created() {
    await this.loadParents()
  },
  mounted() {
  },
  updated() {
  },
}
</script>

<style scoped lang="scss">
.basement {
  .header {
    color: var(--color-2);
    background: var(--background-2);
    display: flex;
    height: 3.5rem;
    padding: 0.5rem 1.5rem;
    align-items: center;
    margin-bottom: 0.5rem;
    justify-content: space-between;
    .breadcrumb {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
    }
    .breadcrumb-li {
      margin-right: 0.5rem;
      display: flex;
      border: 1px solid var(--color-p);
      border-radius: 5px;
    }
    .breadcrumb-li:last-of-type {
      margin-right: 0;
    }
    .breadcrumb-link {
      padding: 0.5rem;
      background: transparent;
      color: var(--color-2);
      text-decoration: none;
      outline: none;
      cursor: pointer;
      white-space: nowrap;
      text-transform: capitalize;
      border: none;
    }
    .select {
      width: 100%;
    }
  }
}
</style>