<template>
  <div class="basement">
<!--    <canvas-space :count-dots="countDots"/>-->
    <the-sunrise/>
    <header v-if="$route.name !== 'book-view'" class="header" :class="{'header--dark': $route.name === 'book-view'}">
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
            <button-day-night @change-theme="changeTheme" :theme-value="theme" />
            <!--            <router-link class="breadcrumb-link" to="/settings">Settings</router-link>-->
          </li>
        </ul>
      </div>
    </header>
    <slot/>
  </div>
</template>

<script>
import TheSunrise from "../components/TheSunrise";
import ButtonDayNight from "../components/ButtonDayNight";

export default {
  name: "LayoutDefault",
  components: {ButtonDayNight, TheSunrise},
  props: {
    parentProps: Object,
    genreProps: Object,
    bookName: String,
  },
  data: () => ({
    activeBurger: false,
    theme: ''
  }),
  methods: {
    async loadCategories() {
      if (this.categories && this.categories.length === 0 && sessionStorage.getItem('lib-token')) {
        await this.$store.dispatch('genre/loadCategories')
      }
    },
    getUsername() {
      const username = sessionStorage.getItem('lib-username')
      if (username) this.$store.commit('user/setUsername', username)
    },
    changeTheme(theme) {
      localStorage.setItem('lib-theme', theme)
      this.theme = theme
      const doc = document.firstElementChild
      doc.setAttribute('color-scheme', this.theme)
    },
    getSavedTheme() {
      this.theme = localStorage.getItem('lib-theme')
      const doc = document.firstElementChild
      doc.setAttribute('color-scheme', this.theme)
    }
  },
  computed: {
    categories() {
      return this.$store.state.genre.categories
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
  created() {
    this.loadCategories()
    this.getUsername()
    this.getSavedTheme()
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
    //background: var(--surface1);
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
        fill: var(--primary);
      }
    }

    .burger.mobile {
      width: 26px;
      height: 24px;
      background-color: var(--surface2);

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
        top: 63px;
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
      .day-night-toggle {
        display: none;
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
          border: 1px solid var(--primary-light);
          border-radius: 5px;
          transition: all linear 0.3s;
        }

        .breadcrumb-li:last-of-type {
          margin-bottom: 0;
          border: none;
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
      .day-night-toggle {
        display: block;
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
    }

    .breadcrumb-li:last-of-type {
      margin-right: 0;
    }

    .breadcrumb-li:hover {
      background-color: var(--surface2);
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
      border: 1px solid var(--primary-dark);
      border-radius: 5px;
    }
    .router-link-active.breadcrumb-link {
      background-color: var(--surface4);
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
    border: 1px solid var(--primary-dark);
    border-radius: 5px;
    text-decoration: none;
  }

}
</style>