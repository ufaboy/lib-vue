<template>
  <div class="flex flex-col text-slate-900 dark:text-white w-96">
    <!--     eslint-disable-next-line vue/no-mutating-props-->
    <textarea class="textarea scrollbar" rows="10" v-if="rawEditor" v-model="editorNode.outerHTML"/>
    <!--     eslint-disable-next-line vue/no-mutating-props-->
    <textarea class="textarea scrollbar" rows="10" v-else v-model="editorNode.innerHTML"/>
    <footer class="mt-3 flex flex-row flex-nowrap justify-between">
      <button class="btn-red" @click="closeModal">Reset</button>
      <button class="btn" @click="rawEditor = !rawEditor">{{ rawEditor ? 'HTML' : 'RAW' }}</button>
      <button class="btn-green" @click="saveEditor">Save</button>
    </footer>
  </div>
</template>

<script setup>
import {ref} from "vue";

// eslint-disable-next-line no-undef
const emit = defineEmits(['save-editor', 'hide-modal'])
// eslint-disable-next-line no-undef,no-unused-vars
const props = defineProps({
  editorNode: {},
})

const rawEditor = ref(false);

function closeModal() {
  emit('hide-modal')
}

function saveEditor() {
  emit('save-editor', props.editorNode.innerHTML)
  closeModal()
}
</script>
