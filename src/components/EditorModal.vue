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
export default {
  name: "EditorModal",
  components: {},
  emits: ['save-editor'],
  props: {
    editorNode: {},
  },
  data: () => ({
    rawEditor: false
  }),
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    saveEditor() {
      this.$emit('save-editor')
      this.closeModal()
    },
    closeModal() {
      this.$parent.hide('editor', this)
    },
  },
  unmounted() {
    this.initialText = ''
  }
}
</script>

<style lang="scss">
.editor-modal {
  padding: 1rem;
  .textarea {
    width: 100%;
    resize: vertical;
    padding: 0.5rem;
    margin-bottom: 1rem;
    color: var(--text2);
    background-color: var(--surface2);
  }

  .btn-bar {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }
}
</style>
