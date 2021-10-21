<template>
  <ul class="navigator">
    <li class="navigator-element">
      <router-link class="navigator-link" to="/">Home</router-link>
    </li>
    <li class="navigator-element">
      <router-link class="navigator-link" to="/book">Books</router-link>
    </li>
    <li class="navigator-element">
      <router-link class="navigator-link" to="/genre">Genre</router-link>
    </li>
    <li class="navigator-element">
      <router-link class="navigator-link" to="/note">Note</router-link>
    </li>
    <li class="navigator-element">
      <router-link class="navigator-link" to="/media">Media</router-link>
    </li>

  </ul>
</template>

<script>
export default {
  name: "SideBarNavigator"
}
</script>

<style lang="scss">
.navigator {
  margin-bottom: 1rem;

  .navigator-element {
    display: flex;
    margin: 0 0 0.5rem 0;

    .navigator-link {
      text-decoration: none;
      color: var(--text);
      width: 100%;
      padding: 0.5rem 0.75rem;
    }
  }

  .navigator-element:last-of-type {
    margin: 0;
  }

  .navigator-element:hover {
    background-color: var(--surface-light);
  }
}
</style>