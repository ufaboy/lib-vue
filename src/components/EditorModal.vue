<template>
  <div class="editor-modal">
<!--     eslint-disable-next-line vue/no-mutating-props-->
    <textarea class="textarea" rows="10" v-if="rawEditor" v-model="editorNode.outerHTML"/>
    <!--     eslint-disable-next-line vue/no-mutating-props-->
    <textarea class="textarea" rows="10" v-else v-model="editorNode.innerHTML"/>
    <footer class="btn-bar">
      <button class="negative-btn" @click="closeModal">Reset</button>
      <button class="regular-btn" @click="rawEditor = !rawEditor">{{rawEditor ? 'HTML' : 'RAW'}}</button>
      <button class="positive-btn" @click="saveEditor">Save</button>
    </footer>
  </div>
</template>

<script>
import {ref} from "vue";

export default {
  name: "EditorModal",
  emits: ['save-editor', 'hide-modal'],
  props: {
    editorNode: {},
  },
  setup(props, {emit}) {
    const rawEditor = ref(false);
    const closeModal = function () {
      emit('hide-modal')
    };
    const saveEditor = function () {
      emit('save-editor')
      closeModal()
    };
    return {rawEditor, closeModal, saveEditor}
  },
}
</script>

<style lang="scss">
.editor-modal {
  padding: 1rem;
  border-radius: 1rem;
  .textarea {
    width: 100%;
    resize: vertical;
    padding: 0.5rem;
    margin-bottom: 1rem;
    color: var(--text);
    background-color: var(--surface);
  }

  .btn-bar {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }
}
</style>
