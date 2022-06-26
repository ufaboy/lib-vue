<template>
  <div class="list-categories w-full lg:absolute lg:top-0 lg:left-[10rem]">
      <nav class="w-full flex flex-col lg:flex-row lg:flex-wrap mt-3 px-3">
        <router-link class="flex justify-center px-4 py-3 w-full lg:w-40 mr-3 mb-3 cursor-pointer rounded-md text-lg capitalize
        ring-1 dark:ring-white hover:ring hover:bg-emerald-100 dark:hover:bg-slate-800"
                     :to="{ name: 'list-genre', params: { name: category.name}}"
                     v-for="category of categories"
                     :key="category.id">{{ category.name }}
        </router-link>
      </nav>
  </div>
</template>

<script setup lang="ts">
document.title = 'Home';
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

</script>

<style lang="scss">
</style>