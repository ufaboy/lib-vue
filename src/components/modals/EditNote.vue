<template>
  <form method="dialog" class="flex flex-col text-slate-900 dark:text-white" @submit.prevent="save">
    <header class="header flex flex-row items-center justify-between mb-2">
      <h1>Note</h1>
      <button class="close-btn" type="reset" @click="emit('close')">
        <IconClose class="icon text-inherit" />
      </button>
    </header>
    <div class="flex flex-col">
      <label class="mb-1">name</label>
      <input type="text" class="input-text" required v-model.trim="name">
    </div>
    <div class="flex flex-col">
      <label class="mb-1">url</label>
      <input type="text" class="input-text" required v-model.trim="url">
    </div>
    <div class="flex flex-col">
      <label class="mb-1">type</label>
      <select class="select" v-model="type">
        <option :value="type" v-for="type in types">{{type}}</option>
      </select>
    </div>
    <footer class="flex flex-row items-center justify-between mt-3">
      <button class="btn-red" type="reset" @click="emit('delete')">Remove</button>
      <button class="btn-green">Save</button>
    </footer>
  </form>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import IconClose from "@/components/icons/IconClose.vue";

interface Note {
  name: string,
  type: string,
  url: string
}
const props = defineProps<{
  note: Note,
  index: number|undefined
}>()
const types: string[] = ['', 'story', 'video', 'site', 'comic', 'channel']

const emit = defineEmits(['create', 'update', 'delete', 'close'])

const name = ref('')
const type = ref('')
const url = ref('')

function save() {
  const data = {'name': name.value, 'type': type.value, 'url': url.value}
  if(isNumber(props.index)) {
    emit('update', data)
  } else emit('create', data)
}
function init() {
  if (props.note) {
    name.value = props.note.name
    type.value = props.note.type
    url.value = props.note.url
  }
}
init()
</script>