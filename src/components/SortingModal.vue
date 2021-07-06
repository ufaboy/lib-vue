<template>
  <main class="sorting">
    <fieldset class="fieldset">
      <legend>sorting
        <base-icon class="icon"><icon-sort-asc v-if="ascending"/><icon-sort-desc v-else/></base-icon>
      </legend>
      <button class="srt-btn" :class="{active: this.orderBy === 'name'}" @click="changeOrderBy('name')">name</button>
      <button class="srt-btn" :class="{active: this.orderBy === 'view_count'}" @click="changeOrderBy('view_count')">view_count</button>
      <button class="srt-btn" :class="{active: this.orderBy === 'rating'}" @click="changeOrderBy('rating')">rating</button>
      <button class="srt-btn" :class="{active: this.orderBy === 'updated_at'}" @click="changeOrderBy('updated_at')">updated</button>
      <button class="srt-btn" :class="{active: this.orderBy === 'last_read'}" @click="changeOrderBy('last_read')">last read</button>
      <button class="close-find" @click="sorting">close&filter</button>
    </fieldset>
  </main>
</template>

<script>
import IconSortAsc from "@/components/icons/IconSortAsc"
import IconSortDesc from "@/components/icons/IconSortDesc"

export default {
  name: "SortingModal",
  components: {IconSortAsc, IconSortDesc},
  emits: ['sorting'],
  props: {},
  data: () => ({
    ascending: 0,
    orderBy: '',
    orderRandom: false
  }),
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    sorting() {
      this.$emit('sorting', {orderBy: this.orderBy, ascending: this.ascending})
      this.closeModal()
    },
    changeOrderBy(e) {
      this.orderBy = e
      this.ascending = !this.ascending
    },
    closeModal() {
      this.$parent.hide('sortings', this)
    },
  },
}
</script>

<style lang="scss">
.sorting {
  padding: 1rem;
  color: var(--color-2);

.close-find {
  color: var(--color-2);
  background-color: #35495e;
  width: 100%;
  padding: 1rem;
  text-align: center;
}
  .srt-btn {
    padding: 0.5rem;
    display: flex;
    margin-bottom: 0.5rem;
    width: 100%;
    color: var(--color-2);
    background-color: var(--background-3);
    text-transform: capitalize;
  }
  .srt-btn:last-of-type {
    margin-bottom: 1rem;
  }
  .srt-btn.active {
    color: var(--color-p);
  }
  .random-btn {
    margin-left: 2rem;
  }
}
</style>
