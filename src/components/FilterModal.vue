<template>
  <form class="filter rad-shadow" method="dialog" @submit.prevent="findBookByFilter">
    <header class="header">
      <span class="filter-title">filter</span>
      <button class="close-btn" type="reset" @click="closeModal">
        <base-icon class="icon" icon-name="close">
          <icon-close/>
        </base-icon>
      </button>
    </header>
    <label class="label">
      <span class="title">genre</span>
      <select class="select" ref="filterBook" name="selectGenre" v-model="filter.genre">
        <optgroup v-for="parent of genres" :key="parent.id" :label="parent.name">
          <option class="value" :value="genre" v-for="genre of parent.childes" :key="genre.id">{{ genre.name }}</option>
        </optgroup>
      </select>
    </label>
    <label class="label">
      <span class="title">rating</span>
      <select class="select" v-model="filter.rating" name="selectRating">
        <option class="value" :value="num" v-for="num of 5" :key="'rating-' + num">{{ num }}</option>
      </select>
    </label>

    <div class="switch">
      <span>ad off</span>
      <input type="checkbox" id="switch" class="switch-input" v-model="filter.ad"/>
      <label for="switch" class="switch-label"></label>
      <span>ad on</span>
    </div>

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
  emits: ['active-filter', 'reset-filter'],
  props: {
    rating: Number,
    ad: Number,
    genre: Object,
  },
  data: () => ({
    filter: {
      rating: null,
      ad: null,
      genre: {},
    },
  }),
  computed: {
    genres() {
      return this.$store.state.genre.items
    },
    username() {
      return this.$store.state.user.username
    }
  },
  methods: {
    async findBookByFilter() {
      this.$emit('active-filter', {genre: Number.isInteger(this.filter.genre.id) ? this.filter.genre : null, rating: this.filter.rating, ad: this.filter.ad})
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
      this.filter.ad = Number.isInteger(this.ad) ?? null
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
  padding: 1rem;

  .header {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    margin-bottom: 0.5rem !important;
  }

  .filter-title {
    text-transform: capitalize;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .label {
    margin-bottom: 1rem;

    .title {
      margin-bottom: 0.3rem;
    }

    .select {
      flex: 1;
    }
  }

  //.switch-label {
  //  margin-bottom: 1rem;
  //}
  .switch {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    input[type=checkbox]{
      height: 0;
      width: 0;
      visibility: hidden;
    }

    .switch-label {
      cursor: pointer;
      width: 80px;
      height: 40px;
      background: grey;
      display: block;
      border-radius: 1rem;
      position: relative;
      margin: 0 0.5rem;
    }

    .switch-label:after {
      content: '';
      position: absolute;
      top: 4px;
      left: 5px;
      width: 1.8rem;
      height: 1.8rem;
      background: #fff;
      border-radius: 20px;
      transition: 0.3s;
    }

    input:checked + label {
      background: #bada55;
    }

    input:checked + label:after {
      left: calc(100% - 5px);
      transform: translateX(-100%);
    }

    label:active:after {
      width: 130px;
    }
  }

  .fieldset {
    padding: 0 7px;
    margin-bottom: 1rem;

    .fieldset__label {
      margin-right: 2rem;
    }

    .fieldset__label:last-of-type {
      margin-right: initial;
    }
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
