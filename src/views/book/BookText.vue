<template>
  <div class="book lg:w-[calc(100%_-_10rem)] bg-white lg:dark:bg-slate-900 sm:dark:bg-neutral-900 text-slate-900 dark:text-[#b3b3b3]"
       :class="{mobile: isMobile()}" @touchstart="touchStart" @touchend="touchEnd">
    <div class="flex flex-row justify-center flex-wrap">
      <div class="article-wrapper w-full">
        <h1 class="book-name text-lg font-bold text-center mb-4">{{book.name}}</h1>
        <ul class="flex-row flex-wrap hidden lg:flex">
          <li class="bg-slate-800 hover:bg-slate-700 rounded-md p-2 mr-3 mb-2"
              v-for="(chapter, index) in headerChapters" :key="index">
            <a :href="`#${chapter.url}`">{{chapter.name}}</a>
          </li>
        </ul>
      </div>
      <article class="text" ref="text" v-html="book.text" @mouseup.ctrl="editMode"></article>
    </div>
    <div class="progress-line" :style="widthProgressLine"></div>
    <TextSettings v-if="slideLeftRight" @scroll-by-click="scrollByClick" :scrolling-progress="scrollingProgress"
                   @hide-modal="slideLeftRight = false"/>
    <dialog ref="textEditorModal" class="dialog dark:bg-slate-800 rounded-lg" @close="showEditorModal = false">
      <EditorModal v-if="showEditorModal" :editor-node="editorNode" @save-editor="saveEditor"
                    @hide-modal="closeDialog"/>
    </dialog>
    <ImageSlider v-if="Number.isInteger(activeImageIndex) && book.files?.length"
                  :raw-images="book.files"
                  :active-image-index="activeImageIndex"
                  @select-image="selectImageByIndex">

    </ImageSlider>
    <teleport v-if="isMobile() && isMounted" to="#header-target">
      <select class="w-full p-2 rounded hover:bg-blue-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 truncate" @change="scrollToChapter" v-model="chapterElement">
        <option v-for="(chapter, index) in headerChapters" :key="index" :value="chapter">
          {{ chapter.name }}
        </option>
      </select>
    </teleport>
    <teleport to="#sidebar-target" v-else-if="isMounted">
      <hr class="my-3">
      <ul>
        <li class="hover:dark:bg-slate-700 mb-2 text-slate-900 dark:text-white cursor-pointer">
          <router-link class="flex w-full p-2" :to="{name: 'book-edit', params: {id: route.params.id}}">Edit</router-link>
        </li>
        <li class="mb-2 p-2 text-slate-900 dark:text-white cursor-pointer">
          <select class="select select-chapter w-full truncate" @change="scrollToChapter" v-model="chapterElement">
            <option v-for="(chapter, index) in headerChapters" :key="index" :value="chapter">
              {{ chapter.name }}
            </option>
          </select>
        </li>
      </ul>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import {ref, onBeforeUnmount, toRefs, inject, nextTick, computed, onMounted} from "vue";
import {useRoute} from "vue-router";
import {API_URL} from '../../../runtimeEnv';
import {isMobile} from "../../utils/helpers";
import {updateBook} from "../../utils/uploadData";
import EditorModal from "@/components/modals/EditorModal.vue";
import useBook from "../../composables/useBook";
import useSwipe from "../../composables/useSwipe";
import TextSettings from "@/components/TextSettings.vue";
import ImageSlider from "@/components/ImageSlider.vue";
import {Author} from "../../interfaces/author";
import {Book} from "../../interfaces/book";

const printToast = inject('printToast') as Function
const saveScrollingBook = inject('saveScrollingBook') as Function


const props = defineProps<{
  windowHeights: number,
  scrollingProgress: {
    progress: number,
    countPages: number,
    clientHeight: number,
    currentPage: number,
  }
}>()
const route = useRoute();
const {book, downloadBook} = useBook();
const {slideLeftRight, touchStart, touchEnd} = useSwipe();

let editingText = ''
const widthProgressLine = computed(() => {
  return {height: `${props.scrollingProgress.progress}vh`}
})
const isMounted = ref(false)
const {windowHeights} = toRefs(props)
const textEditorModal = ref();
const showEditorModal = ref(false);
const activeImageIndex = ref<number | undefined>();
const editorNode = ref<HTMLElement>();
const chapterElement = ref<{name:string, url:string, element:Element}>();
const headerChapters = ref()

function scrollToChapter() {
  if (chapterElement.value) chapterElement.value.element.scrollIntoView()
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
  if (document.documentElement.clientWidth > 800 && book.value.files) {
    const src = (e.target as HTMLImageElement).src
    const replaceValue = `${API_URL}/media/book_${book.value.id}/`
    const fileName = src.replace(replaceValue, '')
    const fileIndex = book.value.files.findIndex(file => file.full_name === fileName)
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
    if (book.value.text) {
      let text = book.value.text.replace(editingText, newText)
      await updateBook({id: book.value.id, name: book.value.name, genres: book.value.genres, text: text})
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
  if (book.value.bookmark) {
    const x = (book.value.bookmark * windowHeights) / 100
    console.log({
      scrollToBookmark: book.value.bookmark,
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

function calcOptionChapterName(chapter:Element) {
    const chapterElem = chapter.querySelector('.chapter-header')
    return chapterElem ? chapterElem.innerHTML : ''
}
async function prepareHeaders() {
  let arr = []
  const chapterElements = document.querySelectorAll('.chapter')
  const h1Element = document.querySelector('.book-name')

  if (h1Element) {
    const item = {name: 'Table Of Content', url: '/', element: h1Element}
    arr.push(item)
    chapterElement.value = {name: 'Table Of Content', url: '/', element: h1Element}
  }
  for (const elem of chapterElements) {
    arr.push({name: calcOptionChapterName(elem), url: elem.id, element: elem})
  }
  headerChapters.value = arr
}

onBeforeUnmount(() => {
  saveScrollingBook(book.value.id)
  removeImageListeners()
});

onMounted(async () => {
  isMounted.value = true
  downloadBook(+route.params.id).then(() => {
    prepareHeaders()
    nextTick(() => {
      scrollToBookmark()
    })
  });
  listenClickByImg();
});

</script>

<style lang="scss">
.book {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  position: absolute;
  .toc {
    display: none;
  }

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
      white-space: nowrap;
    }
  }
  .picture-group {
    display: flex;
    flex-flow: row wrap;
  }

  .picture {
    object-fit: cover;
  }

  .illustrations {
    display: flex;
    flex: 1;

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
    .text {
      .picture, .video {
        float: left;
        width: 375px;
        margin: 0.5rem 1rem 0.5rem 0;
      }
    }
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