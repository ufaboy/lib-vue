<template>
  <div class="notes">
    <header class="header">
      <button class="positive-btn" @click="sendNotes">save</button>
      <button class="notes__btn btn" @click="addNote">add</button>
    </header>
    <table class="notes-table">
      <caption class="caption">Fast Notes Links</caption>
      <thead class="thead">
      <tr>
        <th class="th">index</th>
        <th class="th">name</th>
        <th class="th">
          <span>type</span>
          <div class="cell-dropdown">
            <label v-for="(type, index) of allTypes" :key="index">
              <input type="checkbox" multiple v-model="filterTypes" :value="type">
              {{type}}</label>
          </div>
        </th>
        <th class="th">url</th>
        <th class="th">actions</th>
      </tr>
      </thead>
      <tbody>
      <tr class="note" v-for="(note, index) of filteredNotes" :key="'note-' + index">
        <td class="td">{{ index }}</td>
        <td class="td">
          <input type="text" class="note__name" v-model="note.name">
        </td>
        <td class="td">
          <input type="text" class="note__type" v-model="note.type">
        </td>
        <td class="td">
          <input type="text" class="note__url" v-model="note.url">
        </td>
        <td class="td">
          <button class="td__btn negative-btn" @click="deleteNote(index)">del</button>
        </td>
      </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import {computed, inject, ref} from 'vue';
import {loadNotes} from "@/utils/loadData";
import {$patch} from "@/utils/superFetch";

export default {
  name: "TheNote",
  components: {},
  setup() {
    document.title = 'Notes';
    const loader = inject("loader");
    const notes = ref([]);
    const filterTypes = ref([])
    const allTypes = ref([])
    const filteredNotes = computed(()=>{
      return filterTypes.value.length ? notes.value.filter(note=>filterTypes.value.includes(note.type)) : notes.value;
    })

    const getNotes = async () => {
      const result = await loadNotes()
      if (result) {
        notes.value.push(...JSON.parse(result.text))
        prepareNotes(notes.value)
      }
    };
    const prepareNotes = rawNotes => {
      for (const note of rawNotes) {
        if (!allTypes.value.includes(note.type) && note.type) {
          allTypes.value.push(note.type)
        }
      }
    }
    const addNote = () => {
      notes.value.unshift({url: '', name: '', type: ''})
    };
    const deleteNote = (index) => {
      notes.value.splice(index, 1)
      sendNotes()
    }
    const sendNotes = async () => {
      const formData = {text: JSON.stringify(notes.value)}
      loader.show()
      const result = await $patch('/book/update?id=1', formData)
      loader.hide()
      if (result) {
        notes.value.splice(0, notes.value.length)
        notes.value.push(...JSON.parse(result.text))
        prepareNotes(notes.value)
      }
    }

    getNotes()

    return {notes, filterTypes, allTypes, filteredNotes, getNotes, addNote, deleteNote, sendNotes}
  },
}
</script>

<style lang="scss" scoped>
.notes {
  width: 100%;
  height: calc(100% - 3.5rem);
  padding: 1rem 1.5rem;

  .notes__btn {
    margin-left: 0.5rem;
  }

  .notes-table {
    border: 1px solid;
    border-color: whitesmoke;
    margin-bottom: 1rem;

    .thead {
      border-bottom: 1px solid;
      border-color: inherit;
    }

    .th {
      padding: 0.3rem;
    }

    .td {
      padding: 0.3rem;
      text-align: center;
    }

    .note {
      border-bottom: 1px solid;
      border-color: inherit;
    }
  }

  .note__name, .note__url, .note__type {
    padding: 6px;
  }

  .note__type {
    max-width: 100px;
    min-width: 100px;
  }

  .note__url {
    width: 400px;
  }

  .td__btn {
    margin-right: initial;
  }
}

@media only screen and (max-width: 892px) {
  .notes {
    padding: 0.5rem;

    .note__url {
      width: 100%;
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {
  .notes {
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {
  .notes {
  }
}
</style>