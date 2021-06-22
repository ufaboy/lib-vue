<template>
  <div class="notes">
    <table class="notes-table">
      <caption>Fast Notes Links</caption>
      <thead>
      <th>index</th>
      <th>url</th>
      <th>actions</th>
      </thead>
      <tbody>
      <tr class="note" v-for="(note, index) of notes" :key="'note-' + index">
        <td>{{index}}</td>
        <td>
          <input type="text" class="note__url" v-model="note.url">
        </td>
        <td>
          <button class="note__btn" @click="deleteNote(index)">del</button>
        </td>
      </tr>
      </tbody>
      <tfoot>
      <button @click="addNote">add</button>
      </tfoot>
    </table>
  </div>
</template>

<script>
export default {
  name: "TheNote",
  components: {},
  props: {},
  data: () => ({
    notes: [{url: 'https://habr.com/ru/post/506634/'}, {url: 'https://yiiframework.com.ua/ru/doc/guide/2/helper-array/'}, {url: 'https://habr.com/ru/post/563572/'}],
    loaded: null
  }),
  methods: {
    async loadNotes() {
      const result = await this.$get('/book/view?id=1')
      if (result) {
        this.loaded = result
        console.log({'result': result})
      }
    },
    addNote() {
      this.notes.push({url: ''})
    },
    deleteNote(index) {
      this.notes.splice(index, 1)
      this.sendNotes()
    },
    async sendNotes() {
    }
  },
  computed: {},
  watch: {},
  created() {
    document.title = 'Notes';
    this.loadNotes()
  },
  mounted() {
  },
  updated() {
  },
}
</script>

<style lang="scss" scoped>
.notes {
  width: 100%;
  height: calc(100% - 4rem);
  padding: 0 1.5rem;
}
@media only screen and (max-width: 892px) {
  .notes {}
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {
  .notes {}
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {
  .notes {}
}
</style>