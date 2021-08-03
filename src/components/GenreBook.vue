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
      <div class="parent" :class="{'checked-childes': calcCheckedChildes(category)}" v-for="category of categories" :key="category.id" @click="activeCategory = Number(category.id)">
        <div class="parent-title">{{category.name}}</div>
        <label class="checkbox-container" v-for="genre of category.genres" :key="genre.id">{{ genre.name }}
          <input type="checkbox" :value="genre" v-model="selectedGenre">
          <span class="checkmark"></span>
        </label>
      </div>
    </fieldset>
<!--    <select class="select-genre" multiple v-model="genres" size="1" v-if="$store.state.main.isMobile">-->
<!--      <optgroup v-for="parent of parentGenres" :key="parent.id" :label="parent.name">-->
<!--        <option v-for="genre of parent.childes" :key="genre.id">{{ genre.nane }}</option>-->
<!--      </optgroup>-->
<!--    </select>-->
    <select class="select" v-model="activeGenre" v-if="isMobile" multiple>
      <optgroup :label="category.name" v-for="category of categories" :key="'category-' + category.id">
        <option v-for="genre of category.genres"
                :key="'select-genre'+genre.id"
                :value="genre">{{ genre.name }}
        </option>
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
    activeCategory: '',
    searchField: '',
    selectedGenre: [],
    genres: [],
  }),
  computed: {
    categories() {
      return this.$store.state.genre.categories()
    },
    isMobile() {
      return this.$store.state.main.isMobile
    }
  },
  watch: {},
  created() {
  },
  mounted() {

  },
  methods: {
    sendGenre() {
      this.$emit('set-genres', this.selectedGenre)
      this.closeModal()
    },

    calcCheckedChildes(e) {
      return e.genres.find(item => this.genres.map(genre => genre.id).includes(item.id))
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
  color: var(--text1);
  background-color: var(--surface4);
  border-radius: 10px;

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
  .checkbox-container {
    display: block;
    position: relative;
    padding-left: 25px;
    cursor: pointer;
    text-transform: capitalize;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    height: 1rem;
    width: 1rem;
    background-color: #eee;
  }

  /* On mouse-over, add a grey background color */
  .checkbox-container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .checkbox-container input:checked ~ .checkmark {
    background-color: #2196F3;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .checkbox-container input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .checkbox-container .checkmark:after {
    left: 6px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
}
@media only screen and (max-width: 892px) {
  .select {
    width: 100%;
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
