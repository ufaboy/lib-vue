<template>
  <main class="sorting">
    <fieldset class="fieldset">
      <legend class="fieldset__legend">sorting
        <IconSortAsc class="icon" v-if="ascending"/>
        <IconSortDesc class="icon" v-else/>
      </legend>
      <button class="srt-btn" :class="{active: orderBy === 'name'}" @click="changeOrderBy('name')">name</button>
      <button class="srt-btn" :class="{active: orderBy === 'view_count'}" @click="changeOrderBy('view_count')">
        view_count
      </button>
      <button class="srt-btn" :class="{active: orderBy === 'rating'}" @click="changeOrderBy('rating')">rating
      </button>
      <button class="srt-btn" :class="{active: orderBy === 'updated_at'}" @click="changeOrderBy('updated_at')">
        updated
      </button>
      <button class="srt-btn" :class="{active: orderBy === 'last_read'}" @click="changeOrderBy('last_read')">last
        read
      </button>
      <button class="close-find" @click="sorting">close&filter</button>
    </fieldset>
  </main>
</template>

<script setup>
import IconSortAsc from "@/components/icons/IconSortAsc"
import IconSortDesc from "@/components/icons/IconSortDesc"
import {ref} from "vue";

// eslint-disable-next-line no-undef
const emit = defineEmits(['sorting', 'hide-modal'])
const ascending = ref(0);
const orderBy = ref('');

function sorting() {
  emit('sorting', {orderBy: orderBy.value, ascending: ascending.value})
  closeModal()
}

function changeOrderBy(e) {
  orderBy.value = e
  ascending.value = Number(!ascending.value)
}

function closeModal() {
  emit('hide-modal')
}
</script>

<style lang="scss">
.sorting {
  padding: 1rem;
  color: var(--text);

  .fieldset__legend {
    padding: 5px;
    border-radius: 5px;
  }

  .close-find {
    color: var(--text);
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
    color: var(--text);
    background-color: var(--surface);
    text-transform: capitalize;
  }

  .srt-btn:last-of-type {
    margin-bottom: 1rem;
  }

  .srt-btn.active {
    color: var(--primary);
  }

  .random-btn {
    margin-left: 2rem;
  }
}
</style>
