<template>
  <div class="edit-book flex flex-row flex-nowrap lg:h-screen lg:!fixed ">
    <div class="text-container p-2 lg:fixed lg:h-screen overflow-x-hidden overflow-y-scroll w-full lg:w-[800px] scrollbar">
      <div class="flex flex-row flex-wrap justify-between mb-5">
        <div class="flex flex-row">
          <button class="btn-gray mr-2 mb-2" type="reset" @click="resetBook">reset</button>
          <button class="btn-green mr-2  mb-2" @click="sendBook">save</button>
          <button class="btn-blue mb-2" @click="startTypograf">typograf</button>
        </div>
        <div class="flex flex-row">
          <StarRating class="mr-2" v-model="book.rating" :size="isMobile() ? 24 : 32"/>
          <ToggleAd v-model="book.ad" v-if="getAdAccess()"/>
        </div>
      </div>
      <section class=" flex flex-row flex-wrap lg:flex-nowrap justify-between mb-5">
        <div class="w-full flex flex-col lg:mr-3">
          <label class="">Name</label>
          <input type="text" class="input-text" v-model.trim="book.name">
        </div>
        <div class="w-full flex flex-col lg:mr-3">
          <label class="">Source</label>
          <input type="url"
                 class="input-text"
                 v-model.trim="book.source">
        </div>
        <div class="w-full flex flex-col lg:w-52">
          <label class="">Author</label>
          <select class="select w-full" v-model="authorData">
            <option class="p-1" v-for="(author, index) in authors" :value="author" :key="index">{{ author.name }}
            </option>
          </select>
        </div>
      </section>
      <div class="w-full flex flex-col mb-5">
        <label class="">
          annotation
          <meter class="meter" :value="book.annotation?.length" min="0" max="300" low="30" high="280" optimum="150"/>
        </label>
        <textarea class="textarea" rows="4" maxlength="300" v-model.trim="book.annotation"/>
      </div>
      <select class="select" v-model="genres" v-if="isMobile()" multiple>
        <optgroup :label="category.name" v-for="category of categories" :key="'category-' + category.id">
          <option v-for="genre of category.genres"
                  :key="'select-genre'+genre.id"
                  :value="genre">{{ genre.name }}
          </option>
        </optgroup>
      </select>
      <section class="genre cursor-pointer mb-3" v-else @click="openGenreModal">
        <span v-if="genres.length === 0">Не выбраны жанры</span>
        <span class="mr-1" :style="{color: colorizeGenre(index)}"
              v-for="(genre, index) of genres"
              :key="genre.id">
            {{ genre.name }}
          </span>
      </section>
      <div class="flex flex-col">
        <div class="">
          <span class="mr-3">text {{ book.text ? book.text.length : '' }}</span>
          <span class="action-bar">
          <button class="btn-outline" type="button" @click="toggleEditor">{{ editorMode }}</button>
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
        <textarea class="editor clarity textarea mt-3"
                  v-model="book.text"
                  v-if="editorMode === 'raw'"
                  ref="editor"
        ></textarea>
        <div class="editor" contenteditable="true" v-else v-html="book.text"></div>
      </div>
    </div>
    <MediaContainer class="hidden lg:flex lg:absolute lg:top-0 lg:left-[830px] flex-col"
                    :book-files="book.files"
                    :book-id="book.id"
                    :book-cover-path="book.cover_path"
                    :is-loaded="isLoaded"
                    @uploaded="files = $event"/>
    <dialog ref="genreBookModal"
            class="dialog dialog-genre-book bg-neutral-300 dark:bg-slate-800 text-slate-800 dark:text-white shadow-md rounded-lg"
            @close="genreModalShow = false">
      <GenreBook v-if="genreModalShow" :genres-props="genres" :categories="categories" @set-genres="setGenres"
                 @hide-modal="closeDialog"/>
    </dialog>
    <teleport to="#sidebar-target" v-if="!isMobile() && route.params.id && isMounted">
      <hr class="my-3">
      <ul>
        <li class="hover:dark:bg-slate-700 mb-2 text-slate-900 dark:text-white cursor-pointer">
          <router-link class="flex w-full p-2" :to="{name: 'book-view', params: {id: route.params.id}}">View
          </router-link>
        </li>
      </ul>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import {ref, onUpdated, inject, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import Typograf from "typograf";
import {API_URL} from '../../../runtimeEnv';
import {FileMix, BookSave} from '../../interfaces/book';
import {isMobile} from '../../utils/helpers';
import {loadBook} from '../../utils/loadData';
import {getAdAccess} from '../../utils/userData';
import {deleteFiles, deleteFile, updateBook, uploadFiles} from '../../utils/uploadData';
import useBook from '../../composables/useBook';
import useAuthors from '../../composables/useAuthors'
import GenreBook from '@/components/modals/GenreBook.vue'
import StarRating from "@/components/StarRating.vue";
import ToggleAd from "../../components/ToggleAd.vue";
import MediaContainer from "../../components/MediaContainer.vue";

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

const props = defineProps<{
  categories: CategoryExtended[]
}>()
const printToast = inject('printToast') as Function
const toggleLoader = inject('toggleLoader') as Function

const router = useRouter();
const route = useRoute();
const isMounted = ref(false)
const isLoaded = ref(false)
const {book, authorData, genreBookModal, genreModalShow, openGenreModal, closeDialog} = useBook();
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
    let data: BookSave = {
      id: book.value.id,
      ad: book.value.ad,
      annotation: book.value.annotation,
      cover_path: book.value.cover_path,
      name: book.value.name,
      rating: book.value.rating,
      source: book.value.source,
      text: book.value.text,
      genres: genres.value
    }
    if (authorData.value.id) {
      data.author_id = authorData.value.id
    }
    await updateBook(data)
    await router.replace('/books')
  } catch (e) {
    console.log({sendBook: e, genres: genres.value})
  }
}

function autoResize() {
  if (editor.value) {
    const scrollHeight = Number(editor.value.scrollHeight) + 50;
    editor.value.style.cssText = `height: ${scrollHeight}px`;
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
    toggleLoader(true)
    const result = await loadBook(+route.params.id)
    toggleLoader(false)

    book.value = {...result, ad: result.ad, author: result.author ?? {id: 0, name: '', url: '', ad: false}}
    genres.value = [...result.genres]
    if (result.author) {
      authorData.value = result.author
    }
    isLoaded.value = true
  } catch (e) {
    console.log({getBook: e})
    toggleLoader(false)
  }
}

function startTypograf() {
  let tp = new Typograf({locale: ['ru', 'en-US']});
  let elem: HTMLTextAreaElement = document.querySelector('textarea.editor') as HTMLTextAreaElement;
  const typoResult = tp.execute(elem.value);
  elem.value = typoResult;
  console.log('startTypograf', {typoResult: typoResult})
}

onMounted(() => {
  isMounted.value = true
})
onUpdated(() => {
  if (editor.value && editor.value.scrollHeight > 60) {
    autoResize()
  }
})
getBook();
getAuthors();
</script>
