<template>
  <form class="filter rad-shadow" method="dialog" @submit.prevent="findBookByFilter">
    <header class="header">
      <h2 class="filter-title">filter</h2>
      <button class="close-btn" type="reset" @click="closeModal">
        <IconClose class="icon" />
      </button>
    </header>
    <div class="form-field mb-1">
      <label class="form-field__label">Genre</label>
      <select class="form-field__select" v-model="filter.genre">
        <optgroup :label="category.name" v-for="category of categories" :key="'category-' + category.id">
          <option v-for="genre of category.genres"
                  :key="'select-genre'+genre.id"
                  :value="genre">{{ genre.name }}
          </option>
        </optgroup>
      </select>
    </div>
    <div class="form-field mb-1">
      <label class="form-field__label">Ad</label>
      <div class="toggle toggle--knob" v-if="adAccess">
        <input type="checkbox" id="toggle--knob" class="toggle--checkbox" v-model="filter.ad">
        <label class="toggle--btn" for="toggle--knob">
          <span class="toggle--feature" data-label-on="on" data-label-off="off"></span>
        </label>
      </div>
    </div>
    <div class="form-field mb-1">
      <label class="form-field__label">Rating</label>
      <select class="form-field__select" v-model="filter.rating" name="selectRating">
        <option class="value" :value="rating.value" v-for="(rating, index) of ratingOptions"
                :key="'rating-' + index">{{ rating.value }} {{ rating.name }}
        </option>
      </select>
    </div>
    <footer class="footer">
      <button class="negative-btn" type="button" @click="resetFilter">reset</button>
      <button class="positive-btn">find</button>
    </footer>
  </form>
</template>

<script setup>
import IconClose from "@/components/icons/IconClose"
import {getAdAccess} from "@/utils/userData";
import {ref} from "vue";

// eslint-disable-next-line no-undef
const emit = defineEmits(['active-filter', 'hide-modal', 'reset-filter'])
// eslint-disable-next-line no-undef,no-unused-vars
const props = defineProps({
  categories: Array,
  rating: Number,
  ad: Number,
  genre: Object,
})

const ratingOptions = [
  {name: 'Terrible', value: 1},
  {name: 'Bad', value: 2},
  {name: 'Middle', value: 3},
  {name: 'Good', value: 4},
  {name: 'Fine', value: 5},
]
const adAccess = getAdAccess()

const filter = ref({
  rating: null,
  ad: null,
  genre: {},
})

function loadFilter() {
  filter.value.rating = props.rating ?? null
  if (props.genre) {
    filter.value.genre = props.genre
  }
  filter.value.ad = props.ad ?? null
}

function closeModal() {
  emit('hide-modal')
}

function resetFilter() {
  emit('reset-filter')
  closeModal()
}

function findBookByFilter() {
  emit('active-filter', {
    genre: Number.isInteger(filter.value.genre.id) ? filter.value.genre : null,
    rating: filter.value.rating,
    ad: filter.value.ad
  })
  closeModal()
}

loadFilter()

</script>

<style lang="scss" scoped>
.filter {
  padding: 1rem;
  color: var(--text);

  .header {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    margin-bottom: 0.5rem;
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
    justify-content: space-around;
  }
}

@media only screen and (max-width: 892px) {
  .filter {
    padding: 0.5rem;
    width: 100%;
  }
}
</style>
