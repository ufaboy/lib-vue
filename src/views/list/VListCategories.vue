<template>
  <div class="list-categories w-full lg:absolute lg:top-0 lg:left-[10rem]">
      <nav class="w-full flex md:flex-col lg:flex-row lg:flex-wrap mt-3 px-3">
        <router-link class="content-link md:w-full lg:w-40"
                     :to="{ name: 'list-genre', params: { name: category.name}}"
                     v-for="category of categories"
                     :key="category.id">{{ category.name }}
        </router-link>
      </nav>
  </div>
</template>


<script setup lang="ts">
import {defineProps} from 'vue'

interface Category {
  id: number,
  name: string,
  genres?: Array<Genre>
}

interface Genre {
  id: number,
  name: string,
  description: string,
  category: Category,
  ad: number,
  created_at: number,
}

const props = defineProps<{
  categories: Category[]
}>()

document.title = 'Home';
</script>

<style lang="scss">
.list-categories {
  .content-link {
    display: flex;
    text-decoration: none;
    margin: 0 1rem 1rem 0;
    padding: 1rem 0.5rem;
    text-transform: capitalize;
    cursor: pointer;
    border-radius: 0.5rem;
    font-size: 2rem;
    align-items: center;
    justify-content: space-around;

    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0);
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

/*  .content-link:last-of-type {
    margin-bottom: 0;
    margin-right: 0;
  }*/
}

@media only screen and (max-width: 892px) {
  .home {
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
</style>