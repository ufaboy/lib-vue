<template>
  <div class="basement" @click="activeBurger = false">
    <header id="header" class="header"
            :class="{'header--dark': $route.name === 'book-view', 'header-hide': hideHeader}">
      <div class="header--left">
        <router-link class="breadcrumb-home" to="/">Home</router-link>
      </div>

      <div class="burger" :class="{'mobile': isMobile, 'active': activeBurger}" @click.stop>
        <svg class="icon-btn" @click="activeBurger = !activeBurger" width="100%" height="100%" viewBox="0 0 26 24">
          <rect y="0" width="26" height="4"/>
          <rect y="10" width="26" height="4"/>
          <rect y="20" width="26" height="4"/>
        </svg>
        <ul class="breadcrumb" @click="activeBurger = false">
          <li class="breadcrumb-li" v-if="btnViewEditMode.name">
            <router-link class="breadcrumb-link" :to="btnViewEditMode.path">{{ btnViewEditMode.name }}</router-link>
          </li>
          <li class="breadcrumb-li">
            <router-link class="breadcrumb-link" to="/book">Books</router-link>
          </li>
          <li class="breadcrumb-li">
            <router-link class="breadcrumb-link" to="/genre">Genre</router-link>
          </li>
          <li class="breadcrumb-li">
            <router-link class="breadcrumb-link" to="/note">Note</router-link>
          </li>
        </ul>
      </div>
    </header>
    <router-view v-bind="$attrs" :categories="categories" @scrolling="scrolling"></router-view>
    <component :is="userPreferTheme"></component>
    <teleport to="body">
      <refresh-popup v-if="updateAvailable" :sw-reg="registration" @refresh-sw="refreshApp"/>
    </teleport>
  </div>
</template>

<script>
import {computed, ref} from "vue";
import {useRoute,} from 'vue-router'
import useDevice from "@/composables/useDevice";
import {loadCategories} from "@/utils/loadData";
import RefreshPopup from "../components/RefreshPopup";
import ThemeDark from "../components/ThemeDark";
import ThemeLight from "../components/ThemeLight";
import useTheme from "../composables/useTheme";

export default {
  name: "LayoutMain",
  components: {ThemeLight, ThemeDark, RefreshPopup,},
  setup() {
    const route = useRoute()
    const activeBurger = ref(false)
    const updateAvailable = ref(false)
    const hideHeader = ref(false)
    const registration = ref(null)
    const categories = ref([])
    const {isMobile, isDesktop} = useDevice();
    const {userPreferTheme} = useTheme()
    const btnViewEditMode = computed(() => {
      return route.name === 'book-view' ? {
        name: 'Edit',
        path: `/book/update/${route.params.id}`
      } : route.name === 'book-edit' ? {name: 'View', path: `/book/${route.params.id}`} : {}
    });

    const scrolling = function (e) {
      hideHeader.value = e === 'down' && isMobile.value
    }

    const getCategories = async function () {
      if (categories.value && categories.value.length === 0 && sessionStorage.getItem('lib-token')) {
        categories.value = await loadCategories()
      }
    }
    const swUpdate = function (event) {
      updateAvailable.value = true
      registration.value = event.detail
    }
    const refreshApp = function () {
      updateAvailable.value = false;
      if (!registration.value || !registration.value.waiting) return null;
      registration.value.waiting.postMessage({type: 'SKIP_WAITING'});
    }

    document.addEventListener('swUpdated', swUpdate, {once: true})
    getCategories();

    return {
      activeBurger,
      updateAvailable,
      isMobile,
      isDesktop,
      registration,
      btnViewEditMode,
      categories,
      hideHeader,
      userPreferTheme,
      scrolling,
      getCategories,
      swUpdate,
      refreshApp
    }
  },
  methods: {},
}
</script>

<style scoped lang="scss">
.basement {

}

.header {
  display: flex;
  height: 3.5rem;
  padding: 0.5rem 1.5rem;
  align-items: center;
  justify-content: space-between;
  background-color: var(--primary);
  color: var(--text-primary);

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


  .breadcrumb-link {
    width: 100%;
    padding: 0.5rem;
    background: transparent;
    color: var(--text-primary);
    text-decoration: none;
    outline: none;
    cursor: pointer;
    white-space: nowrap;
    text-transform: capitalize;
    border: none;
    border-radius: 5px;
  }
  .breadcrumb-link:hover {
    background-color: var(--primary-light);
  }
  .router-link-active.breadcrumb-link {
    background-color: var(--primary-dark);
  }

  .select {
    width: 100%;
  }
}

.header.header-hide {
  height: 0;
  padding: 0;
  animation: slide-top 0.5s linear both;
}

@keyframes slide-top {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100px);
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
  border: none;
  border-radius: 5px;
  text-decoration: none;
}
@media only screen and (max-width: 892px) {
.header {
  padding: 0.5rem;
}
}

@media only screen and (max-width: 892px) and (orientation: landscape) {

}

@media only screen and (max-width: 892px) and (orientation: portrait) {

}
</style>