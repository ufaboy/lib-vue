<template>
  <div class="book" :class="{mobile: isMobile()}" @touchstart="touchStart" @touchend="touchEnd">
    <article class="text" ref="text" v-html="book.text" @mouseup.ctrl="editMode"></article>
    <div class="progress-line" :style="widthProgressLine"></div>
    <text-settings v-if="slideLeftRight" @scroll-by-click="scrollByClick" :scrolling-progress="scrollingProgress"
                   @hide-modal="slideLeftRight = false"/>
    <dialog ref="textEditorModal" class="dialog dialog-text" @close="showEditorModal = false">
      <editor-modal v-if="showEditorModal" :editor-node="editorNode" @save-editor="saveEditor"
                    @hide-modal="closeDialog"/>
    </dialog>
    <image-slider v-if="Number.isInteger(activeImageIndex) && book.files?.length"
                  :raw-images="book.files"
                  :active-image-index="activeImageIndex"
                  @select-image="selectImageByIndex"></image-slider>
<!--    <teleport to="#aside">
      <select class="select select-chapter" @change="scrollToChapter" v-model="chapterElement">
        <option v-for="(chapter, index) in chapterOptions" :key="index" :value="chapter">{{
            chapter.innerHTML
          }}
        </option>
      </select>
    </teleport>-->
  </div>
</template>

<script setup lang="ts">
import {ref, onBeforeUnmount, toRefs, inject, computed, onMounted} from "vue";
import {API_URL} from '../../../runtimeEnv';
import {isMobile} from "../../utils/helpers";
import {updateBook} from "../../utils/uploadData";
import EditorModal from "@/components/EditorModal.vue";
import useSlideButton from "../../composables/useSlideButton";
import TextSettings from "@/components/TextSettings.vue";
import ImageSlider from "@/components/ImageSlider.vue";
import {Author} from "../../interfaces/author";

// @ts-expect-error
const printToast: Function = inject('printToast')
// @ts-expect-error
const saveScrollingBook: Function = inject('saveScrollingBook')

interface CategoryExtended extends Category {
  genres?: Array<Genre>
}

interface Category {
  id: number,
  name: string,
}

interface Genre {
  [key: string]: number | string | Category | boolean

  id: number,
  name: string,
  description: string,
  category: Category,
  ad: boolean,
  created_at: number,
}

interface Genre {
  id: number,
  name: string,
  description: string,
  category: Category,
  ad: boolean,
  created_at: number,
}

interface BookFile {
  created_at: number,
  extension: string,
  file_name: string,
  full_name: string,
  id: number,
  path: string,
  size: number,
  type: string,
  url: string,
}

interface Book {
  id: number,
  name: string,
  annotation?: string,
  text?: string,
  book_type?: string,
  source?: string,
  bookmark?: number,
  rating?: number,
  ad?: boolean,
  author?: Author,
  genres: Array<Genre>
  cover_path?: string,
  files?: Array<BookFile>,
  view_count?: number,
  created_at?: number,
  updated_at?: number,
  last_read?: number,
}

const props = defineProps<{
  book: Book,
  windowHeights: number,
  scrollingProgress: {
    progress: number,
    countPages: number,
    clientHeight: number,
    currentPage: number,
  }
}>()

let editingText = ''
const widthProgressLine = computed(() => {
  return {height: `${props.scrollingProgress.progress}vh`}
})

const {windowHeights} = toRefs(props)
const textEditorModal = ref();
const showEditorModal = ref(false);
const activeImageIndex = ref<number | undefined>();
const editorNode = ref<HTMLElement>();
const chapterElement = ref<HTMLElement>();
const chapterOptions = ref<Element[]>([]);
const {slideLeftRight, touchStart, touchEnd} = useSlideButton();


function calcChapterOptions() {
  const chapters = document.getElementsByClassName('zag')
  for (const element of Array.from(chapters)) {
    chapterOptions.value.push(element)
  }
}

function scrollToChapter() {
  chapterElement.value?.scrollIntoView()
}

function editMode(e: Event) {
  editorNode.value = (e.target as HTMLElement)
  editingText = (e.target as HTMLElement).innerHTML
  showEditorModal.value = true
  textEditorModal.value.showModal()
}

function closeDialog() {
  textEditorModal.value.close()
  showEditorModal.value = false
}

function openImage(e: Event) {
  if (document.documentElement.clientWidth > 800 && props.book.files) {
    const src = (e.target as HTMLImageElement).src
    const replaceValue = `${API_URL}/media/book_${props.book.id}/`
    const fileName = src.replace(replaceValue, '')
    const fileIndex = props.book.files.findIndex(file => file.full_name === fileName)
    activeImageIndex.value = fileIndex > -1 ? fileIndex : 0
  }
}

function selectImageByIndex(index: number) {
  activeImageIndex.value = index
}

function listenClickByImg() {
  let images = document.getElementsByClassName('picture')
  for (let image of Array.from(images)) {
    image.addEventListener("click", openImage);
  }
}

function removeImageListeners() {
  let images = document.getElementsByClassName('picture')
  for (let image of Array.from(images)) {
    image.removeEventListener("click", openImage);
  }
}

async function saveEditor(newText: string) {
  try {
    if (props.book.text) {
      let text = props.book.text.replace(editingText, newText)
      await updateBook({id: props.book.id, name: props.book.name, genres: props.book.genres, text: text})
      printToast('Success', 'success')
    }

  } catch (e) {
    printToast(`Ошибка: ${e}`, 'error')
    console.log({'saveEditor error': e})
  }
}

async function scrollToBookmark() {
  const clientHeight = document.documentElement.clientHeight
  const scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
  );
  const windowHeights = scrollHeight - clientHeight;
  if (props.book.bookmark) {
    const x = (props.book.bookmark * windowHeights) / 100
    console.log({
      scrollToBookmark: props.book.bookmark,
      clientHeight: clientHeight,
      scrollHeight: scrollHeight,
      windowHeights: windowHeights
    })
    window.scrollTo(0, x)
  }
}

function scrollByClick(e: Event) {
  const progressElement = document.getElementById("progressbar")
  let w = progressElement ? progressElement.clientWidth : 100;
  let o = (e as MouseEvent).offsetX;
  let x = Math.floor((100 * o) / w);
  (document.getElementById("progressbar") as HTMLProgressElement).value = x;
  let y = Math.floor((windowHeights.value * x) / 100);
  window.scrollTo(0, y);
}

onBeforeUnmount(() => {
  saveScrollingBook(props.book.id)
  removeImageListeners()
});

onMounted(async () => {
  scrollToBookmark();
  listenClickByImg();
  calcChapterOptions();
});

</script>

<style lang="scss">
.book {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  width: 100%;
  position: relative;

  p {
    word-break: break-word;
    padding: initial;
    text-indent: 1rem;
    margin: 0 0 0.3rem;

    span[data-tooltip]:hover {
      color: crimson;
    }
  }

  .text {
    max-width: 900px;
    position: relative;
    letter-spacing: 0.3px;
    line-height: 1.5;
    padding: 0 1rem;
    //content-visibility: auto;

    h1, h2, h3 {
      text-align: center;
    }

    h1 {
      margin: 0 0 1rem 0;
    }

    h2, h3 {
      margin: 1rem 0;
    }
  }

  .toc {
    .toc-anchor {
      text-decoration: none;
      padding: 0.5rem;
      color: var(--primary);
      border: 2px solid var(--primary);
      border-radius: 5px;
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


@media only screen and (min-width: 893px) {
  .book {
    .dialog-text {
      left: calc(50% - 300px);
      top: calc(50% - 160px);
    }
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
      .picture, .video {
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
      .picture, .video {
        width: 100%;
      }
    }
  }
}

@media only screen and (min-width: 893px) and (max-width: 1368px) {
  .book {
    //.text {
    //  .picture, .video {
    //    float: left;
    //    width: 375px;
    //    margin: 0.5rem 1rem 0.5rem 0;
    //  }
    //}
  }
}

@media only screen and (min-width: 1368px) {
  .book {
    .text {
      .picture, .video {
        float: left;
        width: 375px;
        margin: 0.5rem 1rem 0.5rem 0;
      }
    }
  }
}
</style>