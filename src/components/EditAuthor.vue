<template>
  <form method="dialog" class="edit-author" @submit.prevent="updateAuthor">
    <header class="header">
      <h1>Author</h1>
      <button class="close-btn" type="reset" @click="closeModal">
        <IconClose class="icon" />
      </button>
    </header>
    <div class="form-field mb-1">
      <label class="form-field__label">name</label>
      <input type="text" class="form-field__input" required v-model.trim="editableAuthor.name">
    </div>
    <div class="form-field mb-1">
      <label class="form-field__label">url</label>
      <input type="text" class="form-field__input" required v-model.trim="editableAuthor.url">
    </div>
    <footer class="footer">
      <button class="negative-btn" type="reset" @click="deleteAuthor">Удалить</button>
      <button class="positive-btn">Сохранить</button>
    </footer>
  </form>
</template>

<script setup lang="ts">
import IconClose from "@/components/icons/IconClose.vue";
import useAuthor from "../composables/useAuthor";
import {Author} from "../interfaces/author";

const props = defineProps<{
  author: Author,
}>()
const emit = defineEmits(['update-authors', 'hide-modal'])
const {editableAuthor, closeModal, updateAuthor, deleteAuthor} = useAuthor(props, emit)

</script>

<style lang="scss">
.edit-author {
  padding: 1rem;
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  width: 100%;
  color: var(--text);

  .header {
    margin-bottom: 1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .btn-switch {
    font-weight: bold;
  }

  .btn-switch.active {
    color: red;
  }

  .form-field.ad {
    .form-field__label {
      justify-content: center;
    }
    .toggle {
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }

  .footer {
    display: flex;
    width: 100%;
    justify-content: space-between;

    button:last-of-type {
      margin-right: 0;
    }
  }

}
</style>