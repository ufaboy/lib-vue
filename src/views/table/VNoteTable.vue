<template>
  <div class="notes overflow-x-hidden overflow-y-auto">
    <div v-if="isMobile()">
      <section class="note" v-for="(note, index) of filteredNotes" :key="'note-' + index">
        <div class="note-group">
          <label for="note-name">name</label>
          <input id="note-name" type="text" class="input-text" v-model="note.name">
        </div>
        <div class="note-group">
          <label for="note-type">type</label>
          <input id="note-type" type="text" class="input-text" v-model="note.type">
        </div>
        <label for="note-url">type</label>
        <input id="note-url" type="text" class="input-text" v-model="note.url">
      </section>
    </div>
    <table v-else class="notes-table">
      <thead class="thead">
      <tr>
        <th class="th">index</th>
        <th class="th">name</th>
        <th class="th">type
<!--          <select class="select" v-model="filterType">
            <option disabled value="">type</option>
            <option :value="type" v-for="(type, index) in types" :key="index">{{ type }}</option>
          </select>-->
        </th>
        <th class="th">url</th>
        <th class="th">actions</th>
      </tr>
      </thead>
      <tbody>
      <tr class="note row hover:bg-sky-300 hover:dark:bg-slate-700 border-b border-black dark:border-white cursor-pointer"
          v-for="(note, index) of filteredNotes" @click="openRow(note, index)">
        <td class="p-2">{{ index }}</td>
        <td class="p-2">{{note.name}}</td>
        <td class="p-2">{{note.type}}</td>
        <td class="p-2">{{note.url}}</td>
      </tr>
      </tbody>
    </table>
    <teleport to="#sidebar-target" v-if="!isMobile() && isMounted">
      <hr class="my-3">
      <ul>
        <li class="hover:dark:bg-slate-700 mb-2 text-slate-900 dark:text-white cursor-pointer">
          <button class="flex w-full py-1 px-2" @click="createNote">Create</button>
        </li>
      </ul>
    </teleport>
    <dialog ref="modalNote"
            class="dialog bg-neutral-300 dark:bg-slate-800 text-slate-800 dark:text-white shadow-md rounded-lg w-72"
            @close="modalNoteShow = false">
      <EditNote v-if="modalNoteShow" :note="note" :index="index"
                @create="addNote" @update="updateNote" @delete="deleteNote" @close="closeDialog" />
    </dialog>
  </div>
</template>

<script setup lang=ts>
import {computed, inject, onMounted, ref} from 'vue';
import {loadNotes} from "../../utils/loadData";
import {$patch} from "../../utils/superFetch";
import {isMobile} from "../../utils/helpers";
import {API_URL} from "../../../runtimeEnv";
import EditNote from '../../components/modals/EditNote.vue'

interface Note {
  name: string,
  type: string,
  url: string
}

document.title = 'Notes';
const toggleLoader = inject('toggleLoader') as Function
const modalNote = ref<InstanceType<typeof HTMLElement>>()
const notes = ref<Note[]>([]);
const types: string[] = ['', 'story', 'video', 'site', 'comic']
const filterType = ref('')
const note = ref<Note>({name:'', type:'', url: ''})
const index = ref<number|undefined>()
const modalNoteShow = ref(false)
const filteredNotes = computed(() => {
  return filterType.value ? notes.value.filter(note => filterType.value === note.type) : notes.value;
})

async function getNotes() {
  const result = await loadNotes()
  if (result) {
    notes.value.push(...JSON.parse(result.text))
  }
}
function createNote() {
  note.value = {name:'', type:'', url: ''}
  index.value = undefined
  modalNoteShow.value = true
  // @ts-expect-error
  modalNote.value?.showModal()
}
function openRow(noteData:Note, indexData:number) {
  try {
    note.value = noteData
    index.value = indexData
    modalNoteShow.value = true
    // @ts-expect-error
    modalNote.value?.showModal()
  } catch (e) {
    console.log('openRow error', e)
  }
}
async function addNote(note:Note) {
  try {
    notes.value.unshift(note)
    await sendNotes()
    closeDialog()
  } catch (e) {
    console.log('addNote error', e)
  }

}
function deleteNote(): void {
  try {
    if(index.value) {
    notes.value.splice(index.value, 1)
    sendNotes()
    closeDialog()
    }
  } catch (e) {
    console.log('deleteNote error', e)
  }
}
async function updateNote(note:Note) {
  try {
     if(index.value) {
    notes.value[index.value] = note
    await sendNotes()
    closeDialog()
     }
  } catch (e) {
    console.log('updateNote error', e)
  }
}
async function sendNotes() {
  try {
    const formData = {text: JSON.stringify(notes.value)}
    toggleLoader(true)
    const result = await $patch(new URL(`${API_URL}/book/update?id=1`), formData)
    toggleLoader(false)
    notes.value.splice(0, notes.value.length)
    notes.value.push(...JSON.parse(result.text))
  } catch (e) {
    console.log('sendNotes error', e)
    toggleLoader(false)
  }

}
function closeDialog() {
  // @ts-expect-error
  modalNote.value?.close()
  modalNoteShow.value = false
}
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
getNotes()
</script>

<style lang="scss">
</style>