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
      <div class="burger" :class="{'mobile': isMobile, 'active': activeBurger}">
        <svg class="icon-btn" @click="activeBurger = !activeBurger" width="100%" height="100%" viewBox="0 0 26 24">
          <rect y="0" width="26" height="4" fill="black"></rect>
          <rect y="10" width="26" height="4" fill="black"></rect>
          <rect y="20" width="26" height="4" fill="black" />
        </svg>
        <ul class="breadcrumb" @click="activeBurger = false">
          <li class="breadcrumb-li">
            <router-link class="breadcrumb-link" to="/book" >Books</router-link>
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
      </div>

    </header>
    <slot/>
  </div>
</template>

<script>
export default {
  name: "LayoutDefault",
  components: {},
  props: {},
  data: () => ({
    activeBurger: false
  }),
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
    },
    isMobile() {
      return this.$store.state.main.isMobile
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

    .burger {
      cursor: pointer;
      //убрать фон при клике, тапе
      -webkit-tap-highlight-color: transparent;
      outline: none;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      .icon-btn {
        display: none;
      }
    }
    .burger.mobile {
      width: 26px;
      height: 24px;
      background-color: var(--background-2);
      .icon-btn {
        display: block;
      }
      .icon-btn rect {
        transition: transform 0.3s;
      }
      .breadcrumb {
        //opacity: 0;
        position: absolute;
        flex-flow: row wrap;
        width: 100vw;
        left: 0;
        top: 65px;
        height: 0px;
        z-index: 55;
        padding: 0;
        background-color: #000000;
        .breadcrumb-li {
          width: 100%;
          height: 0;
          margin-right: initial;
          border: none;
        }
        .breadcrumb-link {
          display: none;
          border: none;
          padding: 0;
        }
      }

    }
    .burger.mobile.active {
      .breadcrumb {
        height: auto;
        padding: 1rem;
        transition: all linear 0.5s;
        .breadcrumb-li {
          height: auto;
          margin-bottom: 1rem;
          border: 1px solid var(--color-p);
        }
        .breadcrumb-li:last-of-type {
          margin-bottom: 0;
        }
        .breadcrumb-link {
          padding: 0.5rem;
          display: block;
        }
      }
      .icon-btn {
        rect:nth-child(1) {
          transform: rotate(45deg) translate(15%, -10%);
        }
        rect:nth-child(2) {
          transform: rotate(-45deg) translate(-50%, 20%);
        }
        rect:nth-child(3) {
          transform: rotate(-45deg) translate(-50%, -20%);
        }
      }
    }
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
      width: 100%;
      padding: 0.5rem;
      background: transparent;
      color: var(--color-2);
      text-decoration: none;
      outline: none;
      cursor: pointer;
      white-space: nowrap;
      text-transform: capitalize;


    }
    .select {
      width: 100%;
    }
  }
}
</style>