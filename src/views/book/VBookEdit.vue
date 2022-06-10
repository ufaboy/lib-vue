<template>
  <div class="edit-book flex flex-row flex-nowrap px-1 py-2">
    <div class="text-container w-[800px]">
      <div class="flex flex-row justify-between mb-5">
        <div class="flex flex-row">
          <button class="btn-gray mr-2" type="reset" @click="resetBook">reset</button>
          <button class="btn-green mr-2" @click="sendBook">save</button>
          <button class="btn-blue" @click="startTypograf">typograf</button>
        </div>
        <div class="flex flex-row">
          <StarRating class="mr-2" v-model="book.rating" />
          <ToggleAd v-model="book.ad" v-if="getAdAccess()" />
        </div>
      </div>
      <section class=" flex flex-row justify-between mb-5">
        <div class="flex flex-col mr-3">
          <label class="">Name</label>
          <input type="text" class="input-text" v-model.trim="book.name">
        </div>
        <div class="flex flex-col mr-3">
          <label class="">Source</label>
          <input type="url"
                 class="input-text"
                 v-model.trim="book.source">
        </div>
        <div class="flex flex-col w-24">
          <label class="">Author</label>
          <select class="select w-full" v-model="authorData">
            <option class="p-1" v-for="(author, index) in authors" :value="author" :key="index">{{author.name}}</option>
          </select>
        </div>
      </section>
      <div class="flex flex-col mb-5">
        <label class="">
          annotation
          <meter class="meter" :value="book.annotation?.length" min="0" max="300" low="30" high="280" optimum="150"/>
        </label>
        <textarea class="textarea" rows="4" maxlength="300" v-model.trim="book.annotation"/>
      </div>
      <section class="genre cursor-pointer mb-3" @click="openGenreModal">
        <span v-if="genres.length === 0">Не выбраны жанры</span>
        <span class="mr-1" :style="{color: colorizeGenre(index)}"
              v-for="(genre, index) of genres"
              :key="genre.id">
            {{ genre.name }}
          </span>
        <select class="select" v-model="genres" v-if="isMobile()" multiple>
          <optgroup :label="category.name" v-for="category of categories" :key="'category-' + category.id">
            <option v-for="genre of category.genres"
                    :key="'select-genre'+genre.id"
                    :value="genre">{{ genre.name }}
            </option>
          </optgroup>
        </select>
      </section>
      <div class="flex flex-col">
        <div class="">
          <span class="title">text {{ book.text ? book.text.length : '' }}</span>
          <span class="action-bar">
          <button class="editor-btn" type="button" @click="toggleEditor">{{ editorMode }}</button>
            <!-- <button class="editor-btn" type="button" @click="formatText('caret')" data-tooltip="переносы строк">
              <IconCarriage class="icon"/>
            </button>
            <button class="editor-btn" type="button" @click="formatText('double-p')" data-tooltip="двойные <p>">
              <IconParagraph class="icon"/>
            </button>
            <button class="editor-btn" type="button" @click="formatText('comment')" data-tooltip="комментарий">
              <IconSlash class="icon"/>
            </button> -->
        </span>
        </div>
        <textarea class="editor clarity textarea"
                  v-model="book.text"
                  v-if="editorMode === 'raw'"
                  ref="editor"
        ></textarea>
        <div class="editor" contenteditable="true" v-else v-html="book.text"></div>
      </div>
    </div>
    <div class="media-container ml-3" v-if="book.id">
      <header class="header-media">
        <label class="upload-dropbox btn-outline mr-2">Choose files
          <input type="file"
                 class="upload-input hidden desktop"
                 multiple
                 accept="video/webm,image/webp,audio/mpeg"
                 @change="loadFiles">
        </label>
        <button class="btn-green mr-2" @click="uploadAllFiles">Upload all</button>
        <button class="btn-red" @click="deleteAllFiles">Remove all</button>
      </header>

      <div class="media-wrapper">
        <figure class="figure group relative" v-for="(media, index) of files" :key="index">
          <div class="action-panel absolute top-1 left-1 hidden group-hover:flex z-10 w-full flex flex-row flex-wrap justify-between">
            <button class="btn bg-sky-500/50 hover:bg-sky-500/75" @click="uploadSingleFile(media, index)" v-if="!media.id">
              load
            </button>
            <button class="btn bg-sky-500/50 hover:bg-sky-500/75 mr-2"
                    @click="setCover(media)"
                    v-if="checkType(media) === 'image' && media.id">
              {{ getCoverBtnText(media) }}cover
            </button>
            <button class="btn bg-green-500/50 hover:bg-green-500/75 mr-2" @click="copyFileName(media)"
                    v-if="media.id">tag
            </button>
            <button class="btn bg-red-500/50 hover:bg-red-500/75" @click="deleteOneFile(index)" v-if="media.id">
              delete
            </button>
          </div>
          <img class="media image w-72 h-36 object-cover rounded" :src="getSrc(media)" v-if="checkType(media) === 'image'" alt="img">
          <video v-else-if="checkType(media) === 'video'" class="media video" controls>
            <source :src="getSrc(media)">
          </video>
          <audio v-else-if="checkType(media) === 'audio'" class="media audio" controls muted>
            <source :src="getSrc(media)">
          </audio>
          <figcaption class="figure-caption truncate">{{ getCaption(media) }}</figcaption>
        </figure>
      </div>
    </div>
    <dialog ref="genreBookModal" class="dialog dialog-genre-book bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg" @close="showGenreBookModal = false">
      <GenreBook v-if="showGenreBookModal" :genres-props="genres" :categories="categories" @set-genres="setGenres"
                 @hide-modal="closeDialog"/>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, onUpdated, inject} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import Typograf from "typograf";
import {API_URL} from '../../../runtimeEnv';
import {BookFile, FileRaw, BookSave} from '../../interfaces/book';
import {isMobile} from '../../utils/helpers';
import {loadBook} from '../../utils/loadData';
import {getAdAccess} from '../../utils/userData';
import {deleteFiles, deleteFile, updateBook, uploadFiles} from '../../utils/uploadData';
import useBook from '../../composables/useBook';
import useAuthors from '../../composables/useAuthors'
import GenreBook from '@/components/modals/GenreBook.vue'
import StarRating from "@/components/StarRating.vue";
import ToggleAd from "../../components/ToggleAd.vue";


document.title = 'Editor';
interface CategoryExtended extends Category {
  genres?: Array<Genre>
}

interface Category {
  id: number,
  name: string,
}

interface Genre {
  id: number,
  name: string,
  description: string,
  category: Category,
  ad: boolean,
  created_at: number,
}

interface PromiseFulfilledResult {
  status: "fulfilled";
  value: BookFile;
}

interface PromiseRejectedResult {
  status: "rejected";
  reason: string;
}

type PromiseSettledResult = PromiseFulfilledResult | PromiseRejectedResult;
type FileMix = FileRaw | BookFile

const props = defineProps<{
  categories: CategoryExtended[]
}>()
// @ts-expect-error
const printToast: Function = inject('printToast')

// @ts-expect-error
const loader: Loader = inject("loader");
const router = useRouter();
const route = useRoute();
const {book, authorData, genreBookModal, closeDialog, openGenreModal, showGenreBookModal} = useBook();
const {authors, getAuthors} = useAuthors()
const editor = ref<HTMLTextAreaElement>()
const files = ref<FileMix[]>([]);

const genres = ref<Genre[]>([]);
const editorMode = ref('raw');

function resetBook() {
  if (book.value?.id) {
    getBook()
  } else {
    book.value = {
      id: 0,
      name: '',
      annotation: '',
      text: '',
      source: '',
      bookmark: 0,
      cover_path: '',
      rating: 0,
      ad: false,
      author: {id: 0, name: '', url: '', ad: false},
      files: [],
      genres: []
    }
  }
  genres.value = []
}

async function checkBook() {
  let validation = true
  let messages = []
  if (!book.value?.name) {
    messages.push('empty name')
    validation = false
  }
  if (genres.value.length < 1) {
    messages.push('choose at least one genre')
    validation = false
  }
  if (!validation) {
    messages.map(message => printToast(message, 'danger'))
  }
  return validation
}

function toggleEditor() {
  editorMode.value = editorMode.value === 'raw' ? 'html' : 'raw'
}

function setGenres(e: { value: Genre[]; }) {

  book.value.ad = e.value.findIndex((item: Genre) => item.ad) > -1
  genres.value = e.value;
  closeDialog();
}

function colorizeGenre(i: number) {
  const color = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'DeepSkyBlue', 'PURPLE',]
  return color[i]
}

async function sendBook() {
  const check = await checkBook()
  if (!check) {
    return false
  }
  try {
    // let genresIdArray = genres.value.map(genre => genre.id)
    let data:BookSave = {
      id: book.value.id,
      ad: book.value.ad,
      annotation: book.value.annotation,
      cover_path: book.value.cover_path,
      name: book.value.name,
      rating: book.value.rating,
      source: book.value.source,
      text: book.value.text,
      genres: genres.value}
    if (authorData.value.id) {
      data.author_id = authorData.value.id
    }
    await updateBook(data)
    await router.replace('/books')
  } catch (e) {
    console.log({sendBook: e, genres: genres.value})
  }
}

function loadFiles(evt: Event) {
  console.log({loadFiles: evt});
  const fileList = (evt.target as HTMLInputElement).files
  if (fileList) {
    for (const file of Array.from(fileList)) {
      (files.value as FileMix[]).push({name: file.name, status: '', file: file})
    }
  }
}

async function deleteAllFiles() {
  try {
    if (book.value?.id) {
      await deleteFiles(book.value?.id)
      files.value?.splice(0, files.value.length)
    }
  } catch (e) {
    console.log({deleteAllFiles: e})
  }
}

function checkType(media: FileMix) {
  // @ts-expect-error
  const type: string = media.file ? media.file.type : media.type ? media.type : ''
  if (type.includes('image')) {
    return 'image'
  } else if (type.includes('video')) {
    return 'video'
  } else if (type.includes('audio')) {
    return 'audio'
  } else return 'file'
}

async function deleteOneFile(fileIndex: number) {
  try {
    if (files.value) {
      await deleteFile(files.value[fileIndex].id ?? 0);
      files.value.splice(fileIndex, 1)
    }
  } catch (e) {
    console.error({deleteFile: e})
  }
}

async function uploadSingleFile(fileToUpload: FileMix, index: number) {
  if (Array.isArray(files.value) && files.value.length) {
    const fileData = (fileToUpload as FileRaw).file
    const fileArray: File[] = [fileData]
    loader.show();
    // @ts-expect-error
    const response = await uploadFiles(fileArray, book.value.id)
    loader.hide();
    if (response[0].status === 'fulfilled') {
      const result = (response[0] as PromiseFulfilledResult).value
      const fileData = {...result, status: 'fulfilled'}
      files.value.splice(index, 1, fileData)
    } else if (response[0].status === 'rejected') {
      const result = (response[0] as PromiseRejectedResult).reason
      files.value[index].status = 'rejected'
      // @ts-expect-error
      files.value[index].error = result
      printToast('upload error', 'danger')
    }
  }

}

async function uploadAllFiles() {
  try {
    if (Array.isArray(files.value) && files.value.length) {
      // @ts-expect-error
      const fileArray: File[] = files.value.filter(item => item.hasOwnProperty('file')).map(fileObject => fileObject.file)
      loader.show();
      // @ts-expect-error
      const response = await uploadFiles(fileArray, book.value.id)
      loader.hide();

      let errors: string[] = []
      for (const item of response) {
        if (item.status === 'fulfilled') {
          const result = (item as PromiseFulfilledResult).value
          const fileData = {...result, status: 'fulfilled'}
          // @ts-expect-error
          const filesIndex = files.value.findIndex(item => item.name === fileData.full_name)
          files.value.splice(filesIndex, 1, fileData)
        } else if (item.status === 'rejected') {
          const result = (item as PromiseRejectedResult).reason
          // files.value[filesIndex].status = 'rejected'
          // files.value[filesIndex].error = result
          errors.push(result)
        }
      }
      if (errors.length) {
        const toastText = `upload errors: ${errors.length}`
        printToast(toastText, 'danger')
      }
    }
  } catch (e: unknown) {
    if (typeof e === "string") {
      printToast(e, 'danger')
    } else if (e instanceof Error) {
      printToast(e.message, 'danger')
    }
    console.log('uploadAllFiles', {error: e})
  }

}

function autoResize() {
  if (editor.value) {
    const scrollHeight = Number(editor.value.scrollHeight) + 50;
    editor.value.style.cssText = `height: ${scrollHeight}px`;
  }
}

function getSrc(media: FileMix) {
  const loaded = !!media.id
  // @ts-expect-error
  return loaded ? `${API_URL}/${media.url}` : window.URL.createObjectURL(media.file);
}

function getCaption(media: FileMix) {
  const file = media.hasOwnProperty('full_name')
  if (file) {
    return (media as BookFile).full_name
  } else {
    return (media as FileRaw).name
  }
}

function setCover(media: FileMix) {
  const fileData = media as BookFile
  book.value.cover_path = fileData.url
}

function getCoverBtnText(media: FileMix) {
  const fileData = media as BookFile
  book.value.cover_path === fileData.url ? 'current' : 'set'
}

async function copyFileName(file: FileMix) {
  const fileData = file as BookFile
  if (fileData.type.includes('image')) {
    await navigator.clipboard.writeText(`<img class="picture" src="APIURL/${fileData.url}">`)
  } else if (fileData.type.includes('video')) {
    await navigator.clipboard.writeText(`<video class="video" autoplay loop muted controls><source src="APIURL/${fileData.url}"/></video>`)
  } else if (fileData.type.includes('audio/mp4')) {
    await navigator.clipboard.writeText(`<audio class="audio" controls><source src="APIURL/${fileData.url}"/></audio>`)
  }
}

// async function formatText(type:string) {
//   if (type === 'caret') {
//     book.value.text = book.value.text.replace(/\n/g, '<p>')
//   } else if (type === 'double-p') {
//     book.value.text = book.value.text.replace(/<p><p>/g, '<p>')
//   } else if (type === 'comment') {
//     let selectionText = editor.value?.substring(editor.value.selectionStart, editor.value.selectionEnd);
//     if (selectionText.includes('<!-- ') && selectionText.includes(' -->')) {
//       selectionText = selectionText.replace('<!-- ', '');
//       selectionText = selectionText.replace(' -->', '');
//     } else {
//       selectionText = '<!-- ' + selectionText + ' -->'
//     }

//     editor.value.setRangeText(selectionText)
//   }
// }

async function getBook() {
  if (!route.params.id) {
    return null;
  }
  try {
    const result = await loadBook(+route.params.id)
    book.value = {...result, ad: !!result.ad, author: result.author ?? {id: 0, name: '', url: '', ad: false}}
    if (result.files?.length) {
      (files.value as FileMix[]).push(...result.files.map(file => {
        return {...file, status: ''}
      }))
    }
    genres.value = [...result.genres]
    if (result.author) {
      authorData.value = result.author
    }
  } catch (e) {
    console.log({getBook: e})
  }
}
function startTypograf() {
  let tp = new Typograf({locale: ['ru', 'en-US']});
  let elem: HTMLTextAreaElement = document.querySelector('textarea.editor') as HTMLTextAreaElement;
  const typoResult = tp.execute(elem.value);
  elem.value = typoResult;
  console.log('startTypograf', {typoResult:typoResult})
}

onUpdated(() => {
  if (editor.value && editor.value.scrollHeight > 60) {
    autoResize()
  }
})
getBook();
getAuthors();
</script>

<style lang="scss">
/*.edit-book {
  .header {
    width: 100%;
    margin-bottom: 2rem;
  }

  .genre {
    justify-content: initial;
    cursor: pointer;
    border-radius: 5px;
    color: var(--text);

    .select {
      margin: 0.5rem 0 0 0;
      width: 100%;
    }

    > span {
      margin: 0 5px 0 0;
    }
  }


  .section.genre {
    cursor: pointer;
    margin-bottom: 1rem;
  }

  .text-container {

    . {
      margin: 0 0 1rem 0;
    }

    .btn-tab {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 1rem;
      align-items: center;

      .btn-tab--left, .btn-tab--right {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;

      }

      .btn-tab--left {
        > button {
          margin-right: 1rem;
        }
        button:last-child {
          margin-right: 0;
        }
      }

      .btn-tab--right {
        .star-rating {
          margin-right: 1rem;
        }
      }
    }

    .reset-field-btn {
      cursor: pointer;
      padding: 0.3rem;
      display: block;
      color: var(--text);
      background-color: var(--surface);
    }

    .rating {
      width: 150px;
      flex-direction: column;
    }

    .editor {
      width: 100%;
      color: var(--text);
      background-color: var(--surface-light);
      text-transform: initial;
      padding: 0.3rem;

      .title {
        flex-flow: row nowrap;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        width: 100%;
      }

      .editor {
        padding: 5px;
        width: 100%;
        border: 1px solid #000000;
        color: inherit;
        background-color: inherit;
      }

      .editor.clarity {
        resize: vertical;
      }
    }

    .editor-btn {
      color: var(--color-p);
      background-color: transparent;
      padding: 5px 10px;
      cursor: pointer;
      border: 1px solid var(--color-p);
      border-radius: 5px;
      margin-right: 0.5rem;
    }

    .editor-btn:last-of-type {
      margin-right: 0;
    }

    .textarea {
      width: 100%;
      color: var(--color-2);
      background-color: var(--background-2);
      padding: 0.3rem;
    }


    .label--inline {
      flex-flow: row;
      justify-content: initial;
      align-items: center;

      .title, .value {
        width: initial;
      }

      .title {
        margin-right: 1rem;
        margin-bottom: 0;
      }
    }
  }

  .switch-label {
    display: flex;
    align-items: center;

    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
      margin: 0 0.3rem;
    }

    !* Hide default HTML checkbox *!
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    !* The slider *!
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: .4s;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }

    !* Rounded sliders *!
    .slider.round {
      border-radius: 34px;
    }

    .slider.round:before {
      border-radius: 50%;
    }
  }

  .media-container {
    display: flex;
    min-width: 200px;
    height: 100%;
    flex-flow: column;
    flex: 1;
    margin-left: 1rem;

    .header-media {
      margin-bottom: 1rem;
      display: flex;

      .upload-dropbox {
        margin-right: 0.5rem;
      }

      .positive-btn {
        margin-right: 0.5rem;
      }
    }

    .title {
      width: 100%;
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
    }

    .upload-dropbox {
      font-weight: 700;
      color: white;
      background: var(--background-2);
      display: inline-block;
      cursor: pointer;
      padding: 10px 25px;

      .upload-input {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
      }
    }

    .upload-dropbox:hover {
      background: var(--background-3);
    }

    .media-wrapper {
      display: flex;
      flex-flow: row wrap;

      .figure {
        width: 356px;
        padding: 1rem;
        margin: 0 0.5rem 0.5rem 0;
        position: relative;
        border: 1px solid var(--color-p);

        .action-panel {
          position: absolute;
          top: 1rem;
          left: 1rem;
          padding: 0.3rem;
          background: transparent;
          display: block;
          flex-flow: row nowrap;
          align-items: center;
          z-index: 7;


          .loader-ring {
            width: 120px;
            height: 120px;
            z-index: 99;
            margin: auto;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }

        }

        .figure-caption {
          width: 100%;
          text-overflow: ellipsis;
          overflow: hidden;
          cursor: pointer;
          margin-top: 0.5rem;
        }

        .ring {
          top: calc(50% - 72px);
          left: calc(50% - 60px);
        }
      }

      .figure:hover {
        .action-panel {
          display: block;
        }
      }
    }
  }

  .media {
    width: 320px;
    height: 180px;
    border-radius: 0.5rem;
    border: none;

    .thumbnail {
      width: inherit;
      height: inherit;
    }
  }

  .media.image {
    object-fit: cover;
    display: block;

    img, source {
      width: inherit;
      height: inherit;
      object-fit: cover;
    }
  }

  // .media.video {
  // }

  .media.audio {
    width: 100%;
  }

  .toggle-button {
    height: 1.5rem;
    width: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color);
    background-color: var(--background-2);
    cursor: pointer;
    border: 1px solid var(--color-p);
    border-radius: 4px;

    .icon {
      fill: var(--color-p);
    }
  }
}

@media only screen and (min-width: 893px) {
  .edit-book {
    .dialog-genre-book {
      left: calc(50% - 350px);
      top: calc(50% - 210px);
    }
  }
}

@media only screen and (max-width: 892px) {
  .edit-book {
    padding: 0 0.5rem;
    overflow: initial;
    flex-flow: row wrap;

    .media-container {
      .media-wrapper {
        .figure {
          width: 268px;
          padding: 0.5rem;

          .media {
            width: 100%;
          }
        }
      }
    }

    .text-container {
      .text:last-of-type {
        margin-bottom: 0;
      }

      .editor-btn {
        padding: 0.3rem;
      }
    }
  }
}

@media only screen and (max-width: 892px) and (orientation: landscape) {
  .edit-book {
    .text-container {
      width: 100%;
      margin-right: 0;

      // .description {
      // }
    }
  }
}

@media only screen and (max-width: 892px) and (orientation: portrait) {
  .edit-book {
    .text-container {
      width: 100%;
      margin-right: 0;

      .description {
        margin-right: 0;
      }

      .selected {
        overflow: hidden;
      }

      .btn-tab--left, .btn-tab--right {
        width: 100%;
      }

      .btn-tab--left {
        margin-bottom: 0.5rem;
      }
    }

    .media-container {
      .media-wrapper {
        .figure {
          width: 100%;
          margin-right: 0;
        }
      }
    }
  }
}*/
</style>