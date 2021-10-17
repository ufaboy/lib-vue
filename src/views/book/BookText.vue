<template>
  <div class="book" :class="{mobile: isMobile}" @touchstart="touchStart" @touchend="touchEnd">
    <div class="text" ref="text" v-html="book.text" @mouseup.ctrl="editMode"></div>
    <div class="progress-line" :style="widthProgressLine"></div>
    <text-settings v-if="slideLeftRight" @scroll-by-click="scrollByClick" :scrolling-progress="scrollingProgress"
                   @hide-modal="slideLeftRight = false"/>
    <the-modal v-if="showEditorModal">
      <editor-modal :editor-node="editorNode" @save-editor="saveEditor" @hide-modal="showEditorModal = false"/>
    </the-modal>
    <image-slider v-if="Number.isInteger(activeImageIndex)"
                  :raw-images="book.files"
                  :active-image-index="activeImageIndex"
                  @select-image="selectImageByIndex"></image-slider>
  </div>
</template>

<script setup>
import {ref, onBeforeUnmount, onMounted, nextTick, toRefs, inject, computed} from "vue";
import useDevice from "@/composables/useDevice";
import TheModal from "@/components/TheModal";
import {updateBook} from "@/utils/uploadData";
import EditorModal from "@/components/EditorModal.vue";
import useSlideButton from "@/composables/useSlideButton";
import TextSettings from "@/components/TextSettings";
import ImageSlider from "@/components/ImageSlider";

const printToast = inject('printToast')
const saveScrollingBook = inject('saveScrollingBook')

const apiUrl = process.env.VUE_APP_API_URL
// eslint-disable-next-line no-undef,no-unused-vars
const props = defineProps({
  categories: Array,
  book: Object,
  scrollingProgress: {
    type: Object,
    default() {
      return {
        progress: 0,
        countPages: 0,
        clientHeight: 0,
        currentPage: 0,
      }
    }
  },
  windowHeights: {
    type: Number,
    default: 0
  },
})

function setTitle() {
  document.title = props.book.name;
}

setTitle()

const widthProgressLine = computed(() => {
  return {height: `${props.scrollingProgress.progress}vh`}
})

const {windowHeights} = toRefs(props)
const showEditorModal = ref(false);
const activeImageIndex = ref();
const editorNode = ref({});
const {slideLeftRight, touchStart, touchEnd} = useSlideButton();
const {isMobile, isDesktop} = useDevice();

function editMode(e) {
  editorNode.value = e.target
  showEditorModal.value = true
}

function openImage(img) {
  if (document.documentElement.clientWidth > 800) {
    const src = img.target.src
    const replaceValue = `${apiUrl}/media/book_${props.book.id}/`
    const fileName = src.replace(replaceValue, '')
    const fileIndex = props.book.files.findIndex(file => file.full_name === fileName)
    activeImageIndex.value = fileIndex > -1 ? fileIndex : 0
  }
}

function selectImageByIndex(index) {
  activeImageIndex.value = index
}

function moveMedia() {
  let toggleSide = true
  let media = document.querySelectorAll('.media')
  for (const elem of media) {
    elem.classList.add(toggleSide ? 'media--right' : 'media--left')
    toggleSide = !toggleSide
  }
}

function listenClickByImg() {
  let images = document.getElementsByClassName('picture')
  for (let image of images) {
    image.addEventListener("click", openImage);
  }
}

async function saveEditor() {
  try {
    await updateBook({id: props.book.id, text: props.book.text})
    printToast('Success', 'success')
  } catch (e) {
    printToast(`Ошибка: ${e}`, 'error')
    console.log({'saveEditor error': e})
  }
}

async function scrollToBookmark() {
  if (props.book.bookmark) {
    window.scrollTo(0, props.book.bookmark)
  }
}

function scrollByClick(e) {
  let w = document.getElementById("progressbar").clientWidth;
  let o = e.offsetX;
  let x = Math.floor((100 * o) / w);
  document.getElementById("progressbar").value = x;
  let y = Math.floor((windowHeights.value * x) / 100);
  window.scrollTo(0, y);
}

onBeforeUnmount(() => {
  saveScrollingBook(props.book.id)
});
onMounted(async () => {
  await nextTick()
  await scrollToBookmark()
  if (isDesktop.value) moveMedia()
  listenClickByImg()
});

</script>

<style lang="scss">
.book {
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  position: relative;
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
    max-width: 800px;
    position: relative;
    letter-spacing: 0.3px;
    line-height: 1.5;
    padding: 0 0.5rem;
    //content-visibility: auto;

    .media {
      border: none;
      //display: none;
      cursor: pointer;
      width: 480px;
      min-height: 320px;
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

  .text-settings {
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: var(--surface-light);
    width: 100%;
  }

  .progress-line {
    position: fixed;
    width: 3px;
    left: 0;
    top: 0;
    background-color: var(--primary);
  }
}

.image-modal {
  display: flex;
  flex-flow: row nowrap;
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  //padding-top: 100px; /* Location of the box */
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
    //width: 80%;
    max-width: 90vw;
    max-height: 95vh;
  }

  .picture-action-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
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
  .book {
    .book {
      .text {
        max-width: initial;
        width: 100%;

        .media {
          position: static;
          max-height: calc(100vw / 1.5);
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


      .picture-arrow-btn {
        height: 5rem;
        width: 5rem;
        color: var(--primary);
        background-color: var(--surface2);
      }

      .modal-content {
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {
  .book {
    .book {
      .text {
        .media {
          float: left;
          margin: 0 0.5rem 0.5rem 0;
        }
      }
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {
  .book {
    .book {
      .text {
        .media {
          width: 100%;
        }
      }
    }
  }
}

@media only screen and (max-width: 1600px) {
  .book {
    .text {
      max-width: 650px;

      .media {
        width: 375px;
        min-height: 250px;
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