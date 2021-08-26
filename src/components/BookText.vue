<template>
  <div class="book-container" :class="{mobile: isMobile}">
    <div class="book" ref="bookRef" @scroll.passive="handleScroll" id="book">
      <div class="text" ref="text" v-html="book.text" @mouseup.ctrl="editMode"></div>
    </div>
    <footer class="footer" v-if="book.annotation !== 'media'">
      <progress class="progress" :value="progress" max="100" id="progressbar" @click="scrollByClick"/>
      <div class="progress-value">{{ progress }}</div>
    </footer>
    <the-modal v-if="showEditorModal">
      <editor-modal :editor-node="editorNode" @save-editor="saveEditor"/>
    </the-modal>
    <div id="image-modal" class="image-modal" v-if="activeImage">
      <span class="close" @click="activeImage = null">&times;</span>
      <aside class="picture-action-panel">
        <button class="picture-arrow-btn" @click="showSlide('first')">1</button>
        <button class="picture-arrow-btn" @click="showSlide('prev')">Back</button>
      </aside>
      <img class="modal-content" :src="activeImage" alt="image">
      <aside class="picture-action-panel">
        <button class="picture-arrow-btn" @click="showSlide('last')">e</button>
        <button class="picture-arrow-btn" @click="showSlide('next')">Forward</button>
      </aside>
    </div>
  </div>
</template>

<script>
import {ref, defineAsyncComponent, computed, onBeforeUnmount, onMounted, onUpdated, nextTick} from "vue";
import {useStore} from "vuex";
import TheModal from "@/components/TheModal";

const apiUrl = process.env.VUE_APP_API_URL
import {updateBook, updateBookMark} from "@/utils/uploadData";

export default {
  name: "BookText",
  components: {
    TheModal,
    EditorModal: defineAsyncComponent(() => import('@/components/EditorModal.vue')),
  },
  props: {
    book: Object
  },
  emits: [],
  setup(props) {
    const store = useStore();
    const showEditorModal = ref(false);
    const progress = ref(0);
    const progressLoad = ref(0);
    const windowScroll = ref(0);
    const timer = ref(null);
    const activeImage = ref(null);
    const activeImageIndex = ref(0);
    const activeMedia = ref({type: null, url: null});
    const editorNode = ref({});
    const initialText = ref('');

    const windowHeights = computed(() => document.getElementById('book').scrollHeight - document.getElementById('book').clientHeight);
    const isMobile = computed(() => store.state.main.isMobile);

    const editMode = (e) => {
      editorNode.value = e.target
      showEditorModal.value = true
    };
    const openImage = (img) => {
      activeImage.value = img.target.src
    };
    const showSlide = (type) => {
      let index = 0
      if (type === 'prev') {
        index = activeImageIndex.value > 1 ? activeImageIndex.value - 1 : props.book.value.files.length - 1
      } else if (type === 'next') {
        index = activeImageIndex.value < props.book.files.length - 1 ? activeImageIndex.value + 1 : 0
      } else if (type === 'last') {
        index = props.book.value.files.length - 1
      } else if (type === 'first') {
        index = 0
      }
      activeImageIndex.value = index
      activeImage.value = getSrcImgUrl(props.book.value.files[index])
    };
    const getSrcImgUrl = (e) => {
      return e.url ? `${apiUrl}/${e.url}` : ''
    };
    // const prepareUrlForMedia = (book) => {
    //   if (book.text) {
    //     const regexp = new RegExp("APIURL", "g");
    //     book.text = book.text.replace(regexp, process.env.VUE_APP_API_URL)
    //     return book
    //   }
    //   return book
    // };
    const moveMedia = () => {
      let toggleSide = true
      let media = document.querySelectorAll('.media')
      console.log({moveMedia: media})
      for (const elem of media) {
        elem.classList.add(toggleSide ? 'media--right' : 'media--left')
        toggleSide = !toggleSide
      }
    };
    const listenClickByImg = () => {
      let images = document.getElementsByClassName('picture')
      for (let image of images) {
        image.addEventListener("click", openImage);
      }
    };
    const handleScroll = (e) => {
      progress.value = Math.round((e.target.scrollTop * 100) / (e.target.scrollHeight - e.target.clientHeight))
      windowScroll.value = e.target.scrollTop
    };
    const scrollToBookmark = async () => {
      if (props.book.value.bookmark) {
        await this.$nextTick()
        this.$refs.bookRef.scrollTo(0, this.book.bookmark)
      }
    };
    const scrollByClick = (e) => {
      let w = document.getElementById("progressbar").clientWidth;
      let o = e.offsetX;
      let x = (100 * o) / w;
      document.getElementById("progressbar").value = x;
      let y = (windowHeights.value * x) / 100;
      document.getElementById('book').scrollTo(0, y);
    };

    onBeforeUnmount(async () => {
      const formData = {bookId: props.book.id, bookmark: windowScroll.value}
      const result = await updateBookMark(formData)
      if (!result) {
        console.log({'result': result})
      }
    });
    onMounted(async () => {
      await nextTick()
      moveMedia()
      listenClickByImg()
    });
    onUpdated(()=>{
      console.log({onUpdated: 'onUpdated'})
    })

    return {
      progress,
      progressLoad,
      windowScroll,
      showEditorModal,
      timer,
      activeMedia,
      activeImage,
      activeImageIndex,
      editorNode,
      initialText,
      windowHeights,
      isMobile,
      moveMedia,
      handleScroll,
      scrollToBookmark,
      scrollByClick,
      // prepareUrlForMedia,
      listenClickByImg,
      openImage,
      editMode,
      showSlide,
      getSrcImgUrl,
    }
  },
  methods: {
    async saveEditor() {
      try {
        await updateBook({text: this.book.text})
        // this.$toast.success('Успешно сохранено')
      } catch (e) {
        // this.$toast.error(`Ошибка: ${e}`)
        console.log({saveEditor: e})
      }

      // this.book.text = this.$refs.text.innerHTML
      // const url = `/book/update?id=${this.$route.params.id}`
      // const result = await this.$patch(url, {text: this.book.text})
      // if (result) {
      //   this.$toast.success('Успешно сохранено')
      // } else {
      //   console.log({editor: result})
      // }
    },
  },
}
</script>

<style lang="scss">
.book-container {
  height: calc(100vh - 5rem);
  background-color: var(--background);
}

.book-container.mobile {
  height: calc(100vh - 1.5rem);
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
    max-width: 800px;
    position: relative;
    letter-spacing: 0.3px;
    line-height: 1.5;

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
@media only screen and (max-width: 1600px) {
  .book {
    .text {
      max-width: 650px;
      .media {
        width: 375px;
        height: 250px;
      }
      .media--right {
        right: -385px;
      }
      .media--left {
        left: -385px;
      }
    }
  }

}
</style>