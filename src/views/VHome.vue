<template>
  <main class="home">
    <nav class="nav">
      <router-link class="content-link"
                   :to="{ name: 'list-genre', params: { id: category.id, name: category.name}}"
                   v-for="category of categories"
                   :key="category.id">{{ category.name }}
      </router-link>
    </nav>
    <button-theme-switcher />
  </main>
</template>

<script>

import ButtonThemeSwitcher from "../components/ButtonThemeSwitcher";
export default {
  name: 'Home',
  components: {ButtonThemeSwitcher},
  props: {
    categories: Array,
  },
  setup() {
    document.title = 'Home';
  },
}
</script>

<style scoped lang="scss">
.home {
  //height: calc(100% - 4.5rem);
  display: flex;
  padding: 1rem 1.5rem;

  .nav {
    flex: 1;
    display: flex;

    .content-link {
      display: flex;
      flex: 1;
      text-decoration: none;
      margin-right: 1rem;
      padding: 1rem 0.5rem;
      border: 1px solid;
      border-color: var(--primary);
      color: var(--text1);
      background: rgba(0, 0, 0, 0.7);
      text-transform: capitalize;
      cursor: pointer;
      border-radius: 0.5rem;
      font-size: 2rem;
      align-items: center;
      justify-content: space-around;

      box-shadow: inset 0 0 20px rgba(255, 255, 255, 0);
      outline: none;
      text-shadow: none;
      transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
    }

    .content-link:hover {
      outline: 1px solid;
      outline-color: rgba(255, 255, 255, .5);
      outline-offset: 0px;
      box-shadow: inset 0 0 20px rgba(255, 255, 255, .5), 0 0 20px rgba(255, 255, 255, .2);
      outline-color: rgba(255, 255, 255, 0);
      outline-offset: 15px;
      text-shadow: 1px 1px 2px #427388;
    }

    .content-link:last-of-type {
      margin-bottom: 0;
      margin-right: 0;
    }
  }
}

@media only screen and (max-width: 892px) {
  .home {
    padding: 0.5rem;

    .nav {
      flex: 1;
      flex-flow: column nowrap;

      .content-link {
        flex: 1;
        margin-bottom: 1rem;
        margin-right: 0;

        .content-img {
          display: none;
        }

        .content-name {
          display: flex;
        }
      }
    }
  }
}
</style>