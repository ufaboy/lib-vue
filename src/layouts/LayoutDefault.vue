<template>
  <div class="basement">
    <header class="header">
      <ul class="breadcrumb">
        <li class="breadcrumb-li">
          <router-link to="/">Home</router-link>
        </li>
        <li class="breadcrumb-li"><router-link :to="{ name: 'list-genre', params: { id: $route.params.id }}" v-if="listParentTitle">{{listParentTitle}}</router-link></li>
        <li class="breadcrumb-li"><router-link :to="{ name: 'list-book', params: { id: $route.params.id }}" v-if="listGenreTitle">{{listGenreTitle}}</router-link></li>
        <li><span>book</span></li>

      </ul>
      <ul class="breadcrumb">
        <li class="breadcrumb-li">
          <router-link to="/book">Books</router-link>
        </li>
        <li class="breadcrumb-li">
          <router-link to="/genre">Genre</router-link>
        </li>
        <li class="breadcrumb-li">
          <button>log out</button>
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
    checkAuth() {
      const token = sessionStorage.getItem('lib-token') ?? ''
      if (!token) {
        this.$router.push('/login')
      }
    }
  },
  computed: {
    listParentTitle() {
      if (this.$route.name === 'list-genre' && this.$route.params.id) {
        const parent = this.$store.state.genre.items.find(item => item.id === this.$route.params.id)
        return parent.name
      } else if (this.$route.name === 'list-book' && this.$route.params.id) {
        return this.$route.params.parent
      } else return null
    },
    listGenreTitle() {
      if (this.$route.name === 'list-book' && this.$route.params.id) {
        return this.$route.params.name
      } else return null
    }
  },
  watch: {},
  created() {
    this.checkAuth()
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
    padding: 0.5rem 1rem;
    align-items: center;
    margin-bottom: 1rem;
    justify-content: space-between;
    .breadcrumb {
      display: flex;
      flex-flow: row nowrap;
    }
    .breadcrumb-li {
      margin-right: 1rem;
    }
    .breadcrumb-li:last-of-type {
      margin-right: 0;
    }
  }
}
</style>