<template>
  <div class="navigator-mobile" :class="{active: activeBurger, hide: !activeBurger}" @click.stop="activeBurger = false">
    <router-link class="breadcrumb-home" to="/">Home</router-link>
    <svg class="icon-btn" @click.stop="activeBurger = !activeBurger" width="24" height="100%" viewBox="0 0 26 24">
      <rect y="0" width="26" height="4"/>
      <rect y="10" width="26" height="4"/>
      <rect y="20" width="26" height="4"/>
    </svg>
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
      <li class="breadcrumb-li" v-if="btnViewEditMode.name">
        <router-link class="breadcrumb-link" :to="btnViewEditMode.path">{{ btnViewEditMode.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()
const activeBurger = ref(false)
const btnViewEditMode = computed(() => {
  return route.name === 'book-view' ? {
    name: 'Edit',
    path: `/book/update/${route.params.id}`
  } : route.name === 'book-edit' ? {name: 'View', path: `/book/${route.params.id}`} : {}
});
</script>

<style lang="scss">
.navigator-mobile {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 0.5rem 1.5rem;

  .breadcrumb {
    position: absolute;
    z-index: 22;
    left: 0;
    top: 3rem;
    width: 100%;
    padding: 1rem;
    background-color: var(--background);
    color: var(--text);
    box-shadow: 3px 3px 10px 0px rgba(60, 65, 69, 0.5);

    .breadcrumb-li {
      display: flex;
      margin: 0 0 1rem 0;
      border-radius: 5px;
      transition: all linear 0.3s;
    }

    .breadcrumb-li:last-of-type {
      margin: 0;
    }

  }

  .breadcrumb-link {
    color: inherit;
    width: 100%;
    padding: 0.5rem;
    text-decoration: none;
    cursor: pointer;
    white-space: nowrap;
    text-transform: capitalize;
    border: none;
    border-radius: 5px;
  }

  .breadcrumb-home {
    padding: 0.5rem;
    margin-right: 0.5rem;
    display: flex;
    color: var(--text);
    border: none;
    border-radius: 5px;
    text-decoration: none;
  }

  .icon-btn {
    fill: var(--primary);
  }

  @keyframes slide-top {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-100px);
    }
  }
}

.navigator-mobile.active {
  .breadcrumb-li {
    width: auto;
    margin-bottom: 1rem;
    border: 1px solid var(--primary);
    border-radius: 5px;
    background-color: var(--secondary-on);
    transition: all linear 0.3s;
  }

  .breadcrumb-link {
    padding: 0.5rem;
    visibility: visible;
    transition: all linear 0.3s;
  }

  .icon-btn {
    rect {
      transition: transform 0.3s;
    }

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

.navigator-mobile.hide {
  .breadcrumb {
    height: 0;
    padding: 0;
    animation: slide-top 0.5s linear both;

    .breadcrumb-li {
      height: 0;
      margin: 0;
      width: 0;
    }

    .breadcrumb-link {
      visibility: hidden;
      width: inherit;
      height: 0;
    }
  }
}
</style>