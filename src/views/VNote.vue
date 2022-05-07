<template>
  <div class="notes overflow-x-hidden overflow-y-auto">
<!--    <teleport to="#aside" :disabled="isMobile()">
      <section class="sidebar">
        <button class="sidebar-btn btn mb-half" @click="sendNotes">save</button>
        <button class="sidebar-btn btn" @click="addNote">add</button>
      </section>
    </teleport>-->
    <div v-if="isMobile()">
      <section class="note" v-for="(note, index) of filteredNotes" :key="'note-' + index">
        <div class="note-group">
          <label for="note-name">name</label>
          <input id="note-name" type="text" class="note__name" v-model="note.name">
        </div>
        <div class="note-group">
          <label for="note-type">type</label>
          <input id="note-type" type="text" class="note__type" v-model="note.type">
        </div>

        <label for="note-url">type</label>
        <input id="note-url" type="text" class="note__url" v-model="note.url">
      </section>
    </div>
    <table v-else class="notes-table">
      <caption class="caption">Fast Notes Links</caption>
      <thead class="thead">
      <tr>
        <th class="th">index</th>
        <th class="th">name</th>
        <th class="th">
          <select class="p-1" v-model="filterType">
            <option disabled value="">type</option>
            <option :value="type" v-for="(type, index) in types" :key="index">{{type}}</option>
          </select>
        </th>
        <th class="th">url</th>
        <th class="th">actions</th>
      </tr>
      </thead>
      <tbody>
      <tr class="note row hover:dark:bg-slate-700" v-for="(note, index) of filteredNotes" :key="'note-' + index">
        <td class="td">{{ index }}</td>
        <td class="td">
          <input type="text" class="p-2" v-model="note.name">
        </td>
        <td class="td">
          <select class="p-2 cursor-pointer" v-model="note.type">
            <option :value="type" v-for="(type, index) in types" :key="index">{{type}}</option>
          </select>
        </td>
        <td class="td">
          <input type="text" class="p-2" v-model="note.url">
        </td>
        <td class="td">
          <button class="td__btn negative-btn hover:dark:bg-slate-600 p-2 rounded-md" @click="deleteNote(index)">del</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang=ts>
import {computed, inject, ref} from 'vue';
import {loadNotes} from "../utils/loadData";
import {$patch} from "../utils/superFetch";
import {isMobile} from "../utils/helpers";
import {API_URL} from "../../runtimeEnv";

interface Note {
  name:string, type:string, url:string
}
document.title = 'Notes';
const loader = inject("loader");
const notes = ref<Note[]>([]);
const types:string[] = ['', 'story', 'video', 'site', 'comic']
const filterType = ref('')
const filteredNotes = computed(() => {
  return filterType.value ? notes.value.filter(note => filterType.value === note.type) : notes.value;
})

const getNotes = async () => {
  const result = await loadNotes()
  if (result) {
    notes.value.push(...JSON.parse(result.text))
  }
};

const addNote = () => {
  notes.value.unshift({url: '', name: '', type: ''})
};
const deleteNote = (index:number):void => {
  notes.value.splice(index, 1)
  sendNotes()
}
const sendNotes = async () => {
  const formData = {text: JSON.stringify(notes.value)}
  // @ts-expect-error
  loader.show()
  const result = await $patch(new URL(`${API_URL}/book/update?id=1`), formData)
  // @ts-expect-error
  loader.hide()
  if (result) {
    notes.value.splice(0, notes.value.length)
    notes.value.push(...JSON.parse(result.text))
  }
}

getNotes()
</script>

<style lang="scss">
.notes {
  padding: 1rem 1.5rem;

  .notes__btn {
    margin-left: 0.5rem;
  }

  .td__btn {
    margin-right: initial;
  }
}
@media only screen and (min-width: 893px) {
  .notes {
/*    .notes-table {
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

      .cell-dropdown {
        display: flex;
        flex-flow: row nowrap;
        margin-top: 0.5rem;
      }
    }
    .note__type {
      max-width: 100px;
      min-width: 100px;
    }

    .note__url {
      width: 400px;
    }*/
  }
}

@media only screen and (max-width: 892px) {
/*  .notes {
    padding: 0.5rem;
    .note-group {
      width: 49%;
    }
    .note {
      border-radius: 5px;
      padding: 0.5rem;
      margin-bottom: 1rem;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      background-color: var(--surface-light);

      label {
        width: 100%;
        font-size: 1.5rem;
      }
      input {
        width: 100%;
      }
    }

    .note__url {
      width: 100%;
    }
  }*/
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