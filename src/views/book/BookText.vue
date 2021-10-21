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
import TheModal from "@/components/TheModal.vue";
import {updateBook} from "@/utils/uploadData";
import EditorModal from "@/components/EditorModal.vue";
import useSlideButton from "@/composables/useSlideButton";
import TextSettings from "@/components/TextSettings.vue";
import ImageSlider from "@/components/ImageSlider.vue";

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
  // let toggleSide = true
  let media = document.querySelectorAll('.media')
  for (const elem of media) {
    elem.classList.add('media--right')
    // elem.classList.add(toggleSide ? 'media--right' : 'media--left')
    // toggleSide = !toggleSide
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
    padding: 0 1rem;
    //content-visibility: auto;

    .media {
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

@media only screen and (max-width: 892px) {
  .book {
    .text {
      max-width: initial;
      width: 100%;
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {
  .book {
    .text {
      .media {
        float: left;
        margin: 0 0.5rem 0.5rem 0;
        max-width: 394px;
      }
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {
  .book {
    .text {
      .media {
        width: 100%;
      }
    }
  }
}

@media only screen and (min-width: 893px) and (max-width: 1600px) {
  .book {
    .text {
      .media {
        cursor: pointer;
        width: 375px;
        min-height: 320px;
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
@media only screen and (max-width: 1600px) {
  .book {
    .text {
      .media {
        cursor: pointer;
        max-width: 700px;
        min-height: 320px;
      }
      .media--right {
        right: -764px;
      }

      .media--left {
        left: -385px;
      }
    }
  }
}
</style>