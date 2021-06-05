<template>
<form class="filter" method="dialog" @submit.prevent="findBookByFilter">
  <header class="header">
    <span class="filter-title">filter</span>
    <button class="close-btn" type="reset" @click="closeModal">
      <base-icon class="icon" icon-name="close"><icon-close/></base-icon>
    </button>
  </header>
  <label class="label">
    <span class="title">genre</span>
    <select class="select" ref="filterBook" name="selectGenre" v-model="filter.genre">
      <optgroup v-for="parent of genres" :key="parent.id" :label="parent.name">
        <option class="value" :value="genre" v-for="genre of parent.childes" :key="genre.id">{{genre.name}}</option>
      </optgroup>

    </select>
  </label>
  <label class="label">
    <span class="title">rating</span>
    <select class="select" v-model="filter.rating" name="selectRating">
      <option class="value" :value="num" v-for="num of 5" :key="'ratin-' + num">{{num}}</option>
    </select>
  </label>
  <button v-if="$store.state.user.name === 'admin'"
          type="button"
          class="btn-switch btn"
          :class="{'active': genre.ad}"
          @click="filter.genre.ad = !genre.ad">ad
  </button>
  <footer class="footer">
    <button class="negative-btn" type="button" @click="resetFilter">reset</button>
    <button class="positive-btn">find</button>
  </footer>
</form>
</template>

<script>
import IconClose from "@/components/icons/IconClose"
export default {
  name: "FilterModal",
  components: {
    IconClose,
  },
  props: {
    rating: Number,
    ad: Number,
    genre: Object,
  },
  data: ()=>({
    filter: {
      rating: null,
      ad: null,
      genre: {},
    },
  }),
  computed: {
    genres() {
      return this.$store.state.genre.items
    }
  },
  methods: {
    async findBookByFilter() {
      this.$emit('active-filter', {genre: this.filter.genre, rating: this.filter.rating, ad: this.filter.ad})
      this.closeModal()
    },
    resetFilter() {
      this.$emit('reset-filter')
      this.closeModal()
    },
    loadFilter() {
      this.filter.rating = this.rating ?? null
      if (this.genre) {
        this.filter.genre = this.genre
      }
      this.filter.ad = this.ad ?? null
    },
    closeModal() {
      this.$parent.hide('filterBookModal', this)
    },
  },
  created() {
    this.loadFilter()
  }
}
</script>

<style lang="scss">
.filter {
  color: var(--color);
  background-color: var(--background-2);
  padding: 1rem;
  .header {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    margin-bottom: 0.5rem!important;
  }

  .filter-title {
    text-transform: capitalize;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  .label {
    margin-bottom: 0.5rem;
    .title {
      margin-bottom: 0.3rem;
    }
    .select {
      flex: 1;
    }
  }
.switch-label {
  margin-bottom: 1rem;
}

  .footer {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    button {
      text-transform: capitalize;
    }
    button:last-of-type {
      margin-right: 0;
    }
  }
}
@media only screen and (max-width: 892px) {
  .filter {
    padding: 0.5rem;
    width: 100%;
  }
}
</style>
