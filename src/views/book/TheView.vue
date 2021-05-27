<template>
  <div class="book-container" >
    <div class="book" ref="book" @scroll="handleScroll" id="book">
      <div class="text" ref="text" v-html="book.text" @mouseup.ctrl="editMode"></div>
    </div>
  </div>
  <footer class="footer" v-if="book.annotation !== 'media'">
    <progress class="progress" :value="progress" max="100" id="progressbar" @click="scrollByClick"/>
    <div class="progress-value">{{ progress }}</div>
  </footer>
  <modal ref="editor">
    <editor-modal :editor-node="editorNode" @save-editor="saveEditor"/>
  </modal>
</template>

<script>
import EditorModal from "@/components/EditorModal";
import {$patch} from "@/service/superFetch";

export default {
  name: "Book",
  components: {EditorModal},
  props: {},

  data: () => ({
    book: {annotation: null, text: null, genres: []},
    progress: 0,
    progressLoad: 0,
    windowScroll: 0,
    timer: null,
    activeImage: null,
    activeImageIndex: 0,
    activeMedia: {type: null, url: null},
    editorNode: {},
    initialText: ''
  }),
  methods: {
    async loadBook() {
      const token = sessionStorage.getItem('lib-token') ?? ''
      const Bearer = `Bearer ${token}`;
      const url = `${process.env.VUE_APP_API_URL}/book/view?id=${this.$route.params.id}`;
      let response = await fetch(url, {
        headers: {
          Authorization: Bearer
        }
      })
      if (response) {
        const reader = response.body.getReader();
        const contentLength = response.headers.get('Content-Length') ? +response.headers.get('Content-Length') : +response.headers.get('Data-Size');
        let receivedLength = 0; // количество байт, полученных на данный момент
        let chunks = []; // массив полученных двоичных фрагментов (составляющих тело ответа)
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const {done, value} = await reader.read();
          if (done) {
            break;
          }
          chunks.push(value);
          receivedLength += value.length;
          let percent = Math.round(receivedLength * 100 / contentLength)
          if (percent >= 100) {
            percent = 100
            setTimeout(() => this.progressLoad = 0, 500)
          }
          this.progressLoad = percent
        }
        let chunksAll = new Uint8Array(receivedLength); // (4.1)
        let position = 0;
        for (let chunk of chunks) {
          chunksAll.set(chunk, position); // (4.2)
          position += chunk.length;
        }
        this.book = JSON.parse(new TextDecoder("utf-8").decode(chunksAll));
      }
    },
    scrollByClick(e) {
      let w = document.getElementById("progressbar").clientWidth;
      let o = e.offsetX;
      let x = (100 * o) / w;
      console.log({'scrollByClick': e, 'y': y, 'x': x, 'o': o})
      document.getElementById("progressbar").value = x;
      let y = (this.windowHeights * x) / 100;
      document.getElementById('book').scrollTo(0, y);

    },
    editMode(e) {
      this.editorNode = e.target
      this.$showModal('editor')
    },
    async saveEditor() {
      this.book.text = this.$refs.text.innerHTML
      const url = `/book/update?id=${this.$route.params.id}`
      const result = await $patch(url, {text: this.book.text})
      if (result) {
        this.$toast.success('Успешно сохранено')
      } else {
        console.log({editor: result})
      }
    },
    handleScroll(e) {
      this.progress = Math.round((e.target.scrollTop * 100) / (e.target.scrollHeight - e.target.clientHeight))
    },
    scrollLog(e) {
      console.log({'e': e})
    }
  },
  computed: {
    windowHeights() {
      return document.getElementById('book').scrollHeight - document.getElementById('book').clientHeight
    },
  },
  watch: {},
  created() {
    this.loadBook()
  },
  mounted() {
  },
  updated() {
  },
}
</script>

<style scoped lang="scss">
.book-container {
  height: calc(100vh - 6rem);
}

.book {
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  overflow-y: auto;
height: 100%;
  padding: 1rem;
  justify-content: center;

  p {
    word-break: break-word;
    padding: initial;
    margin: initial;
    text-indent: 1rem;
    margin-bottom: 0.3rem;
  }

  .text {
    max-width: 700px;
    position: relative;

    .media {
      border: none;

      display: none;
      cursor: pointer;
      width: 480px;
      height: 320px;
    }

    .media--right {
      position: absolute;
      right: -500px;
    }

    .media--left {
      position: absolute;
      left: -500px;
    }

    h1, h2, h3 {
      text-align: center;
      margin-bottom: 0.5rem;
    }
  }

  .picture {
    width: inherit;
    height: inherit;
    object-fit: cover;
  }

  .illustrations {
    display: flex;
    flex: 1;

  }
}

.footer {
  width: 100%;
  height: 2rem;
  display: flex;
  padding: 0.2rem 0.5rem;

  .progress {
    width: 100%;
    height: 100%;
    background: var(--bg-secondary);
  }

  .progress-value {
    position: absolute;
    left: 50%;
    bottom: 5px;
    color: var(--color);
  }

  .progress::-webkit-progress-value {
  }
}
</style>