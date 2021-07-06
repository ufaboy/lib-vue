<template>
  <form class="genre-book" @submit.prevent="sendGenre">
    <header class="modal-header">
      <h1>Genre</h1>
      <span>{{genres.length}}</span>
      <button class="close-btn" type="reset" @click="closeModal">
        <base-icon class="icon" icon-name="close">
          <icon-close/>
        </base-icon>
      </button>
    </header>
    <fieldset class="genre-titles">
      <legend>selected: {{selectedGenre.length}}</legend>
      <span v-if="selectedGenre.length === 0">Не выбраны жанры</span>
      <span class="fieldset-genre" :style="{color: colorizeGenre(index)}" v-for="(genre, index) of selectedGenre" :key="genre.id">{{genre.name}}</span>
    </fieldset>
    <fieldset class="genres" v-if="$store.state.main.isDesktop">
      <legend>all genres</legend>
      <div class="parent" :class="{'checked-childes': calcCheckedChildes(parent)}" v-for="parent of parentGenres" :key="parent.id" @click="activeParent = Number(parent.id)">
        <div class="parent-title">{{parent.name}}</div>
        <label class="checkbox-container" v-for="genre of parent.childes" :key="genre.id">{{ genre.name }}
          <input type="checkbox" :value="genre" v-model="selectedGenre">
          <span class="checkmark"></span>
        </label>
      </div>
    </fieldset>
    <select class="select-genre" multiple v-model="genres" size="1" v-if="$store.state.main.isMobile">
      <optgroup v-for="parent of parentGenres" :key="parent.id" :label="parent.name">
        <option v-for="genre of parent.childes" :key="genre.id">{{ genre.nane }}</option>
      </optgroup>
    </select>
    <footer class="footer">
      <button class="negative-btn" type="button" @click="reset">сброс</button>
      <button class="positive-btn">Сохранить</button>
    </footer>
  </form>
</template>

<script>
import IconClose from "@/components/icons/IconClose"
export default {
  name: "GenreBook",
  components: {IconClose},
  emits: ['set-genres'],
  props: {
    genresProps: Array,
  },
  data: () => ({
    activeParent: '',
    searchField: '',
    selectedGenre: [],
    genres: [],
  }),
  computed: {
    parentGenres() {
      return this.$store.state.genre.items
    }
  },
  watch: {},
  created() {
    this.loadGenres()
  },
  mounted() {

  },
  methods: {
    sendGenre() {
      this.$emit('set-genres', this.selectedGenre)
      this.closeModal()
    },

    calcCheckedChildes(e) {
      return e.childes.find(item => this.genres.map(genre => genre.id).includes(item.id))
    },
    async loadGenres() {
      if (this.$store.state.genre.items.length === 0) {
        await this.$store.dispatch('genre/loadGenres')
      }
      this.genres = this.$store.state.genre.items.map(a => ({...a}))
      this.selectedGenre = this.genresProps.map(a => ({...a}))
    },
    colorizeGenre(i) {
      const color = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'DeepSkyBlue', 'PURPLE', ]
      return color[i]
    },
    reset() {
      this.selectedGenre = this.genresProps.map(a => ({...a}))
    },
    closeModal() {
      this.$parent.hide('genreBook', this)
    }
  },
}
</script>

<style lang="scss">
.genre-book {
  display: flex;
  flex-flow: row wrap;
  padding: 1rem;
  height: 100%;
  width: 100%;
  color: var(--color-2);
  .modal-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-bottom: 1rem;
    width: 100%;
  }
  .search-field {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  .genre-titles {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
  }
  .fieldset-genre {
    margin-right: 5px;
  }
  .genres {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    padding: 0.5rem;
  }
  .parent {
    cursor: pointer;
    margin: 0 0.5rem 0.5rem 0;
    width: 25%;

    .parent-title {
      text-transform: capitalize;
      margin-bottom: 0.5rem;
    }
  }
  .parent.checked-childes {
    .parent-title {
      color: var(--color-p);
    }

  }
  .checkbox-container {
    margin-bottom: 0.5rem;
    text-overflow: ellipsis;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }
  .select-genre {
    width: 100%;
    margin-bottom: 1rem;
  }
  .footer {
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
    width: 100%;
  }
  button {
    display: flex;
    align-items: center;
  }
}
@media only screen and (min-width: 412px) and (max-width: 892px) and (orientation: landscape) {
  .genre-book {
  }
}

@media only screen and (min-width: 412px) and (max-width: 892px) and (orientation: portrait) {
  .genre-book {
  }
}
</style>
