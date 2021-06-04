<template>
  <div class="editor-modal">
<!--     eslint-disable-next-line vue/no-mutating-props-->
    <textarea class="textarea" name="" id="" rows="10" v-model="editorNode.innerHTML"/>
    <footer class="btn-bar">
      <button class="negative-btn" @click="closeModal">сброс</button>
      <button class="positive-btn" @click="saveEditor">сохранить</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: "EditorModal",
  components: {},
  props: {
    editorNode: {},
  },
  data: () => ({
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
  color: var(--color);
  background-color: var(--background-2);
  .textarea {
    width: 100%;
    resize: vertical;
    padding: 0.5rem;
    margin-bottom: 1rem;
    color: var(--color-2);
    background-color: var(--background-3);
  }

  .btn-bar {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }
}
</style>
