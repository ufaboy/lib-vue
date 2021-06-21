<template>
  <div class="book-container" v-bind="$attrs">
    <div class="book" ref="book" @scroll.passive="handleScroll" id="book">
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
  <div id="image-modal" class="image-modal" v-if="activeImage">
    <span class="close" @click="activeImage = null">&times;</span>
    <aside class="picture-action-panel">
      <button class="picture-arrow-btn" @click="showSlide('first')">1</button>
      <button class="picture-arrow-btn" @click="showSlide('prev')">Back</button>
    </aside>
    <img class="modal-content" id="img01" :src="activeImage">
    <aside class="picture-action-panel">
      <button class="picture-arrow-btn" @click="showSlide('last')">e</button>
      <button class="picture-arrow-btn" @click="showSlide('next')">Forward</button>
    </aside>
  </div>
</template>

<script>
import EditorModal from "@/components/EditorModal";
const apiUrl = process.env.VUE_APP_API_URL

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
        const result = JSON.parse(new TextDecoder("utf-8").decode(chunksAll));
        if (await this.checkLoadedBook(result)) {
          await this.relocateToMedia(result)
        } else {
          this.book = await this.prepareUrlForMedia(result)
          document.title = `Book: ${result.name}`;
        }

      }
    },
    async checkLoadedBook(book) {
      return book.genres.findIndex(genre => genre.parent.name === 'comics') > -1
    },
    async relocateToMedia(book) {
      await this.$emit('loaded-book', book)
      await this.$router.push({name: 'book-media', params: {id: book.id}})
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
      this.$modal.show('editor', this)
    },
    async saveEditor() {
      this.book.text = this.$refs.text.innerHTML
      const url = `/book/update?id=${this.$route.params.id}`
      const result = await this.$patch(url, {text: this.book.text})
      if (result) {
        this.$toast.success('Успешно сохранено')
      } else {
        console.log({editor: result})
      }
    },
    handleScroll(e) {
      this.progress = Math.round((e.target.scrollTop * 100) / (e.target.scrollHeight - e.target.clientHeight))
    },
    prepareUrlForMedia(book) {
      if(book.text) {
        const regexp = new RegExp("APIURL", "g");
        book.text = book.text.replace(regexp, process.env.VUE_APP_API_URL)
        return book
      }
      return book

    },
    moveMedia() {
      let toggleSide = true
      let media = document.querySelectorAll('.media')

      for (const elem of media) {
        elem.classList.add(toggleSide ? 'media--right' : 'media--left')
        toggleSide = !toggleSide
      }
    },
    scrollLog(e) {
      console.log({'e': e})
    },
    listenClickbyImg() {
      let images = document.getElementsByClassName('picture')
      for (let image of images) {
        image.addEventListener("click", this.openImage);
      }
    },
    openImage(img) {
      this.activeImage = img.target.src
    },
    showSlide(type) {
      let index = 0
      if (type === 'prev') {
        index = this.activeImageIndex > 1 ? this.activeImageIndex - 1 : this.book.files.length - 1
      } else if (type === 'next') {
        index = this.activeImageIndex < this.book.files.length - 1 ? this.activeImageIndex + 1 : 0
      } else if (type === 'last') {
        index = this.book.files.length - 1
      } else if (type === 'first') {
        index = 0
      }
      this.activeImageIndex = index
      this.activeImage = this.getSrcImgUrl(this.book.files[index])
    },
    getSrcImgUrl(e) {
      return e.url ? `${apiUrl}/${e.url}` : ''
    },
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
    this.moveMedia()
    this.listenClickbyImg()
  },
}
</script>

<style lang="scss">
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
    text-indent: 1rem;
    margin: 0 0 0.3rem;
    position: relative;
    span[data-tooltip]:hover {
      color: crimson;
    }
  }

  .text {
    max-width: 700px;
    position: relative;

    .media {
      border: none;
      //display: none;
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
  position: relative;

  .progress {
    width: 100%;
    height: calc(100% - 5px);
    background: var(--bg-secondary);
    position: absolute;
    left: 0;
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
.image-modal {
  //display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.9); /* Black w/ opacity */
  .modal-content {
    margin: auto;
    display: block;
    width: 80%;
    max-width: 700px;
  }

  /* Caption of Modal Image (Image Text) - Same Width as the Image */
  #caption {
    margin: auto;
    display: block;
    width: 80%;
    max-width: 700px;
    text-align: center;
    color: #ccc;
    padding: 10px 0;
    height: 150px;
  }

  /* Add Animation - Zoom in the Modal */
  .modal-content, #caption {
    animation-name: zoom;
    animation-duration: 0.6s;
  }
}
@keyframes zoom {
  from {
    transform: scale(0)
  }
  to {
    transform: scale(1)
  }
}

/* The Close Button */
.close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

@media only screen and (max-width: 892px) {
  .book-container {
    .book {
      .text {
        max-width: initial;
        width: 100%;

        .media {
          position: static;
          width: 100%;
          max-height: calc(var(--media-width) / 1.5);
        }
      }
    }

    .image-modal {
      padding: 0.3rem;
      height: 100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;

      .close {
        top: 0;
      }

      .picture-action-panel {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }

      .picture-arrow-btn {
        height: 5rem;
        width: 5rem;
        color: var(--color-2);
        background-color: var(--background-3);
      }

      .modal-content {
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {

}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {

}
</style>