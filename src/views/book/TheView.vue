<template>
  <div class="book-container" v-bind="$attrs">
    <div class="book" ref="book" @scroll.passive="handleScroll" id="book">
      <div class="text" ref="text" v-html="book.text" @mouseup.ctrl="editMode"></div>
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
  </div>
</template>

<script>
import {defineAsyncComponent} from "vue";

const apiUrl = process.env.VUE_APP_API_URL

export default {
  name: "Book",
  components: {
    EditorModal: defineAsyncComponent(() => import('@/components/EditorModal.vue')),
  },
  emits: ['loaded-book'],
  props: {},

  data: () => ({
    book: {annotation: null, text: null, genres: [], bookmark: null},
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
      const url = `/book/view?id=${this.$route.params.id}`;
      const result = await this.$get(url)
      if (result) {
        this.book = await this.prepareUrlForMedia(result)
        document.title = `Book: ${result.name}`;
        this.$emit('loaded-book', {name: result.name, genre: result.genres[0]})
        this.scrollToBookmark()
      } else {
        console.log({'result': result})
      }
    },
    async scrollToBookmark() {
      if (this.book.bookmark) {
        await this.$nextTick()
        this.$refs.book.scrollTo(0, this.book.bookmark)
      }
    },
    async relocateToMedia(book) {
      await this.$router.push({name: 'book-media', params: {id: book.id}})
    },
    scrollByClick(e) {
      // console.log({scrollHeight: document.getElementById('book').scrollHeight, clientHeight: document.getElementById('book').clientHeight})
      let w = document.getElementById("progressbar").clientWidth;
      let o = e.offsetX;
      let x = (100 * o) / w;
      document.getElementById("progressbar").value = x;
      let y = (this.windowHeights * x) / 100;
      document.getElementById('book').scrollTo(0, y);
      // console.log({'scrollTo': e, w:w, o:o, x: x, y: y})
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
      this.windowScroll = e.target.scrollTop

    },
    prepareUrlForMedia(book) {
      if (book.text) {
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
    listenClickByImg() {
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
    async updateScrollProgress() {
      const url = `/book/update-book?id=${this.book.id}`;
      const formData = {bookmark: this.windowScroll}
      const result = await this.$patch(url, formData)
      if (result) {
        console.log({'result': result})
      } else {
        console.log({'result': result})
      }
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
  beforeUnmount() {
    this.updateScrollProgress()
  },
  updated() {
    this.moveMedia()
    this.listenClickByImg()
  },
}
</script>

<style lang="scss">
.book-container {
  height: calc(100vh - 5rem);
  background-color: var(--surface1);

}

.book {
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  overflow-y: auto;
  height: 100%;
  padding: 1rem;
  justify-content: center;
  content-visibility: auto;
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
  height: 1.5rem;
  display: flex;
  padding: 0 0.5rem;
  position: relative;

  .progress {
    width: 100%;
    height: 100%;
    background: var(--bg-secondary);
    position: absolute;
    left: 0;
  }

  .progress-value {
    position: absolute;
    left: 50%;
    height: 100%;
    display: flex;
    align-items: center;
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