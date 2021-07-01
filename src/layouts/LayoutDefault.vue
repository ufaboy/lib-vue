<template>
  <div class="basement">
<!--    <canvas-space :count-dots="countDots"/>-->
    <the-sunrise/>
    <header class="header" :class="{'header--dark': $route.name === 'book-view'}">
      <div class="header--left">
        <router-link class="breadcrumb-home" to="/">Home</router-link>
        <ul class="breadcrumb" v-if="isDesktop">
          <li class="breadcrumb-li" v-if="parentProps">
            <router-link class="breadcrumb-link" :to="{ name: 'list-genre', params: { id: parentProps.id }}">
              {{ parentProps.name }}
            </router-link>
          </li>
          <li class="breadcrumb-li" v-if="genreProps">
            <router-link class="breadcrumb-link" :to="{ name: 'list-book', params: { id: genreProps.id }}">
              {{ genreProps.name }}
            </router-link>
          </li>
          <li class="breadcrumb-li" v-if="bookName">
          <span class="breadcrumb-link">
            {{ bookName }}
          </span>
          </li>
        </ul>
      </div>

      <div class="burger" :class="{'mobile': isMobile, 'active': activeBurger}">
        <svg class="icon-btn" @click="activeBurger = !activeBurger" width="100%" height="100%" viewBox="0 0 26 24">
          <rect y="0" width="26" height="4"/>
          <rect y="10" width="26" height="4"/>
          <rect y="20" width="26" height="4"/>
        </svg>
        <ul class="breadcrumb" @click="activeBurger = false">
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
      </div>
    </header>
    <slot/>
  </div>
</template>

<script>
import TheSunrise from "../components/TheSunrise";

export default {
  name: "LayoutDefault",
  components: {TheSunrise},
  props: {
    parentProps: Object,
    genreProps: Object,
    bookName: String,
  },
  data: () => ({
    activeBurger: false
  }),
  methods: {
    async loadParents() {
      if (this.genresParent && this.genresParent.length === 0 && sessionStorage.getItem('lib-token')) {
        await this.$store.dispatch('genre/loadGenres')
      }
    },
    getUsername() {
      const username = sessionStorage.getItem('lib-username')
      if (username) this.$store.commit('user/setUsername', username)
    }
  },
  computed: {
    genresParent() {
      return this.$store.state.genre.items
    },
    isMobile() {
      return this.$store.state.main.isMobile
    },
    isDesktop() {
      return this.$store.state.main.isDesktop
    },
    countDots() {
      return this.isMobile ? 100 : 500
    }
  },
  watch: {},
  async created() {
    await this.loadParents()
    this.getUsername()
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
    //color: var(--color-2);
    //background: var(--background-2);
    display: flex;
    height: 3.5rem;
    padding: 0.5rem 1.5rem;
    align-items: center;
    justify-content: space-between;

    .header--left {
      display: flex;
      flex-flow: row nowrap;
    }
    .burger {
      cursor: pointer;
      //убрать фон при клике, тапе
      -webkit-tap-highlight-color: transparent;
      outline: none;
      -ms-touch-action: manipulation;
      touch-action: manipulation;

      .icon-btn {
        display: none;
        fill: var(--brand);
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
        color: var(--text2);
        background-color: var(--surface2);

        .breadcrumb-li {
          width: 100%;
          height: 0;
          margin-right: initial;
          border: none;
        }

        .breadcrumb-link {
          //display: none;
          visibility: hidden;
          border: none;
          padding: 0;
        }
      }

    }

    .burger.mobile.active {
      .breadcrumb {
        height: auto;
        padding: 1rem;
        transition: all linear 0.3s;

        .breadcrumb-li {
          height: auto;
          margin-bottom: 1rem;
          border: 1px solid var(--brand);
          transition: all linear 0.3s;
        }

        .breadcrumb-li:last-of-type {
          margin-bottom: 0;
        }

        .breadcrumb-link {
          padding: 0.5rem;
          visibility: visible;
          transition: all linear 0.3s;
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
      border: 1px solid var(--text1);
      border-radius: 5px;
    }

    .breadcrumb-li:last-of-type {
      margin-right: 0;
    }

    .breadcrumb-li:hover {
      background-color: var(--surface4);
    }

    .breadcrumb-link {
      width: 100%;
      padding: 0.5rem;
      background: transparent;
      color: var(--text1);
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

  .header.header--dark {
    background-color: var(--surface2);
  }

  .breadcrumb-home {
    padding: 0.5rem;
    margin-right: 0.5rem;
    display: flex;
    color: var(--text1);
    border: 1px solid var(--text1);
    border-radius: 5px;
    text-decoration: none;
  }
}
</style>