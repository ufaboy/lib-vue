<template>
  <div class="notes">
    <header class="header">
      <button class="positive-btn" @click="sendNotes">save</button>
    </header>
    <table class="notes-table">
      <caption class="caption">Fast Notes Links</caption>
      <thead class="thead">
      <tr>
        <th class="th">index</th>
        <th class="th">url</th>
        <th class="th">actions</th>
      </tr>

      </thead>
      <tbody>
      <tr class="note" v-for="(note, index) of notes" :key="'note-' + index">
        <td class="td">{{ index }}</td>
        <td class="td">
          <input type="text" class="note__url" v-model="note.url">
        </td>
        <td class="td">
          <button class="td__btn negative-btn" @click="deleteNote(index)">del</button>
        </td>
      </tr>
      </tbody>
    </table>
    <button class="notes__btn btn" @click="addNote">add</button>
  </div>
</template>

<script>
export default {
  name: "TheNote",
  components: {},
  props: {},
  data: () => ({
    notes: [],
  }),
  methods: {
    async loadNotes() {
      const result = await this.$get('/book/view?id=1')
      if (result) {
        this.notes.push(...JSON.parse(result.text))
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
      const formData = {text: JSON.stringify(this.notes)}
      const result = await this.$patch('/book/update?id=1', formData)
      if (result) {
        console.log({'result': result})
      }

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
  height: calc(100% - 3.5rem);
  padding: 1rem 1.5rem;

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

  .note__url {
    padding: 6px;
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