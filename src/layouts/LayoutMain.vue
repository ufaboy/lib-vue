<template>
  <div class="basement" @click="activeBurger = false">
    <header id="header" class="header">
      <div class="header-block">
        <router-link class="breadcrumb-home" to="/">Home</router-link>
      </div>
      <!--      <div id="header-middle" class="header-block">-->
      <!--        <input type="search" class="search-text" v-model.trim="searchField" placeholder="Search...">-->
      <!--      </div>-->
      <div class="header-block">
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
      </div>

    </header>
    <router-view v-bind="$attrs" :categories="categories" :scrolling-progress="scrollingProgress"
                 :window-heights="windowHeights"></router-view>
    <!--    <component :is="userPreferTheme"></component>-->

  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, provide, ref} from "vue";
import {useRoute,} from 'vue-router'
import useDevice from "@/composables/useDevice";
import {loadCategories} from "@/utils/loadData";
import useScroll from "../composables/useScroll";
import {updateBookMark} from "../utils/uploadData";
// import useTheme from "../composables/useTheme";
// import ThemeDark from "../components/ThemeDark";
// import ThemeLight from "../components/ThemeLight";

const route = useRoute()
// const searchField = ref('')
const activeBurger = ref(false)
const categories = ref([])
const {isMobile} = useDevice();
const {
  scrollingProgress,
  scrollTop,
  windowHeights,
  // hideByScroll,
  throttleScroll
} = useScroll()
// const {userPreferTheme} = useTheme()
const btnViewEditMode = computed(() => {
  return route.name === 'book-view' ? {
    name: 'Edit',
    path: `/book/update/${route.params.id}`
  } : route.name === 'book-edit' ? {name: 'View', path: `/book/${route.params.id}`} : {}
});
// const hideHeader = computed(() => {
//   return route.name === 'book-view' && isMobile.value && hideByScroll.value
// })
// const hideHeader = computed(()=>{
//   return isMobile.value && hideByScroll.value
// })
// const headerSticky = computed(() => {
//   return route.name === 'book-view' && !hideHeader.value
// })
async function saveScrollingBook(id) {
  const formData = {bookId: id, bookmark: scrollTop.value}
  const result = await updateBookMark(formData)
  if (!result) {
    console.log({'saveScrollingBook': result})
  }
}

async function getCategories() {
  if (categories.value && categories.value.length === 0 && sessionStorage.getItem('lib-token')) {
    categories.value = await loadCategories()
  }
}

getCategories();
window.addEventListener('scroll', throttleScroll, {passive: true})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', throttleScroll, {passive: true})
})

provide('saveScrollingBook', saveScrollingBook)
</script>

<style scoped lang="scss">
.basement {

  .header {
    display: flex;
    height: 3.5rem;
    padding: 0.5rem 1.5rem;
    align-items: center;
    justify-content: space-between;

    .header-block {
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
        fill: var(--secondary);
      }

      .breadcrumb {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
      }
    }

    .burger.mobile {
      width: 26px;
      height: 24px;

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
        color: var(--text);
        background-color: var(--surface);
        box-shadow: 3px 3px 10px 0px rgba(60, 65, 69, 0.5);

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
      text-decoration: none;
      outline: none;
      cursor: pointer;
      white-space: nowrap;
      text-transform: capitalize;
      border: none;
      border-radius: 5px;
    }

    .select {
      width: 100%;
    }

    .search-text {
      border: none;
      display: flex;
      flex: 1;
      background-color: inherit;
      color: var(--text-primary);
    }
  }

  .header.header-hide {
    height: 0;
    padding: 0;
    animation: slide-top 0.5s linear both;
  }

  .header-sticky {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  @keyframes slide-top {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-100px);
    }
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

@media (prefers-color-scheme: no-preference), (prefers-color-scheme: light) {
  .basement {
    .header {
      background-color: var(--primary);
      color: var(--text-primary);

      .burger .breadcrumb {
        color: var(--text-primary);
        background-color: var(--primary);

        .breadcrumb-link {
          background: inherit;
          color: inherit;
        }

        .breadcrumb-link:hover {
          background-color: var(--primary-dark);
        }

        .router-link-active.breadcrumb-link {
          background-color: var(--primary-light);
        }
      }
    }
  }
}

@media (prefers-color-scheme: dark) {
  .basement {
    .header {
      background-color: var(--surface);
      color: var(--surface-on);

      .burger .breadcrumb {
        background-color: var(--surface);
        color: var(--surface-on);

        .breadcrumb-link {
          background: transparent;
          color: var(--surface-on);
        }

        .breadcrumb-link:hover {
          background-color: var(--primary-light);
        }

        .router-link-active.breadcrumb-link {
          background-color: var(--primary);
        }
      }
    }
  }
}
</style>