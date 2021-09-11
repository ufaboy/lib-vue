<template>
  <div class="edit-book">
    <div class="text-container">
      <div class="btn-tab">
        <div class="btn-tab--left">
          <button class="negative-btn" type="reset" @click="resetBook">reset</button>
          <button class="positive-btn" @click="sendBook">save</button>
        </div>
        <div class="btn-tab--right">
          <star-rating v-model="book.rating"></star-rating>
          <div class="toggle toggle--knob" v-if="adAccess">
            <input type="checkbox" id="toggle--knob" class="toggle--checkbox" v-model="book.ad">
            <label class="toggle--btn" for="toggle--knob">
              <span class="toggle--feature" data-label-on="on" data-label-off="off"></span>
            </label>
          </div>
        </div>
      </div>

      <section class="section row">
        <form-field :placeholder="'name'">
          <input type="text" class="ml-value" v-model.trim="book.name" placeholder="name"
                 @focus="$event.target.placeholder = ''" @blur="$event.target.placeholder = 'name'">
        </form-field>
        <form-field :placeholder="'source'">
          <input type="url"
                 class="ml-value"
                 placeholder="source"
                 v-model.trim="book.source"
                 @focus="$event.target.placeholder = ''"
                 @blur="$event.target.placeholder = 'source'">
        </form-field>
      </section>
      <form-field :placeholder="'annotation'">
        <template #header>
          <span class="ml-head">
          annotation
        <meter class="meter" :value="book.annotation?.length" min="0" max="300" low="30" high="280"
               optimum="150"/>
        </span>
        </template>
        <textarea class="ml-value textarea" rows="4" maxlength="300" v-model.trim="book.annotation"
                  placeholder="annotation" @focus="$event.target.placeholder = ''"
                  @blur="$event.target.placeholder = 'annotation'"/>
      </form-field>
      <section class="section genre" @click="openGenreModal">
        <div class="value row">
          <span v-if="genres.length === 0">Не выбраны жанры</span>
          <span class="value genre-span"
                :style="{color: colorizeGenre(index)}"
                v-for="(genre, index) of genres"
                :key="genre.id">
            {{ genre.name }}
          </span>
        </div>
      </section>
      <div class="label">
        <span class="label-header">
          <span class="title">text {{ book.text ? book.text.length : '' }}</span>
          <span class="action-bar">
          <button class="editor-btn" type="button" @click="toggleEditor">{{ editorMode }}</button>
          <button class="editor-btn" type="button" @click="formatText('caret')" data-tooltip="переносы строк">
            <base-icon class="icon">
              <icon-carriage/>
            </base-icon>
          </button>
          <button class="editor-btn" type="button" @click="formatText('double-p')" data-tooltip="двойные <p>">
            <base-icon class="icon">
              <icon-paragraph/>
            </base-icon>
          </button>
          <button class="editor-btn" type="button" @click="formatText('comment')" data-tooltip="комментарий">
            <base-icon class="icon">
              <icon-slash/>
            </base-icon>
          </button>
        </span>
        </span>
        <textarea class="editor clarity"
                  v-model="book.text"
                  v-if="editorMode === 'raw'"
                  ref="editor"
                  @input="autoResize"
        ></textarea>
        <div class="editor" contenteditable="true" v-else v-html="book.text"></div>
      </div>
    </div>
    <div class="media-container" v-if="book.id">
      <header class="header-media">
        <label class="upload-dropbox">Choose files
          <input type="file"
                 class="upload-input desktop"
                 multiple
                 @change="loadFiles($event.target.files)">
        </label>
        <button class="positive-btn" @click="sendFiles()">all upload</button>
        <button class="negative-btn" @click="deleteAllFiles">remove files</button>
      </header>

      <div class="media-wrapper">
        <figure class="figure" v-for="(media, index) of files" :key="'origy' + index">
          <div class="action-panel">
            <button class="image-entry-btn btn--green" @click="sendFiles(media)" v-if="media.id === undefined">
              load
            </button>
            <button class="image-entry-btn"
                    @click="book.cover_path = media.url"
                    v-if="checkType(media) === 'image' && media.id !== undefined">
              {{ book.cover_path === media.url ? 'current' : 'set' }}cover
            </button>
            <button class="image-entry-btn btn--green" @click="copyFileName(media)"
                    v-if="media.id !== undefined">tag
            </button>
            <button class="image-entry-btn btn--red" @click="deleteOneFile(index)" v-if="media.id !== undefined">
              delete
            </button>
          </div>
          <img class="media image" :src="getSrc(media)" v-if="checkType(media) === 'image'" alt="img">
          <video v-else-if="checkType(media) === 'video'" class="media video" controls>
            <source :src="getSrc(media)">
          </video>
          <audio v-else-if="checkType(media) === 'audio'" class="media audio" controls muted>
            <source :src="getSrc(media)">
          </audio>
          <figcaption class="figure-caption">{{ media.name ? media.name : media.full_name }}</figcaption>
        </figure>
      </div>
    </div>
    <the-modal :width="750" v-if="showGenreBookModal" @hide-modal="showGenreBookModal = false">
      <genre-book :genres-props="genres" @set-genres="setGenres" @hide-modal="showGenreBookModal = false"/>
    </the-modal>
  </div>
</template>

<script>
import {ref, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useStore} from 'vuex'
// import StarRating from 'vue-star-rating'
import IconParagraph from '@/components/icons/IconParagraph.vue'
import IconCarriage from '@/components/icons/IconCarriage.vue'
import IconSlash from '@/components/icons/IconSlash.vue'
import GenreBook from '@/components/GenreBook.vue'
import FormField from '@/components/FormField.vue'
import {loadBook} from "@/utils/loadData";
import {getAdAccess} from "@/utils/userData";
import {deleteFiles, deleteFile, updateBook, uploadFiles} from "@/utils/uploadData";
import TheModal from "@/components/TheModal";
import StarRating from "@/components/StarRating";

export default {
  name: "BookEdit",
  components: {StarRating, TheModal, IconParagraph, IconCarriage, IconSlash, GenreBook, FormField, },
  setup() {
    document.title = 'Editor';
    const router = useRouter();
    const route = useRoute();
    const store = useStore()
    const showGenreBookModal = ref(false);
    const files = ref([]);
    const book = ref({
      id: null,
      name: null,
      annotation: '',
      text: '',
      source: null,
      cover: null,
      rating: null,
      ad: false,
      cover_path: '',
      files: []});
    const genres = ref([]);
    const editorMode = ref('raw');
    const expandText = ref(false);
    const expandIllustration = ref(false);
    const adAccess = computed(() => getAdAccess());
    const isDesktop = computed(() => store.state.main.isDesktop);

    const resetBook = () => {
      if (book.value.id) {
        getBook()
      } else {
        book.value = {
          id: null,
          name: null,
          annotation: '',
          text: '',
          source: null,
          cover: null,
          rating: null,
          ad: false,
          cover_path: '',
          files: []}
      }
      genres.value = []
    };
    const openGenreModal = () => {
      showGenreBookModal.value = true
    };
    const checkBook = async () => {
      let validation = true
      let messages = []
      if (!book.value.name) {
        messages.push('empty name')
        validation = false
      }
      if (genres.value.length < 1) {
        messages.push('choose at least one genre')
        validation = false
      }
      if (!validation) {
        // this.$toast.error(messages);
      }
      return validation
    };
    const toggleEditor = () => {
      editorMode.value = editorMode.value === 'raw' ? 'html' : 'raw'
    };
    const setGenres = (e) => {
      book.value.ad = e.value.findIndex(item => item.ad) > -1
      genres.value = e.value;
      showGenreBookModal.value = false;
    };
    const colorizeGenre = (i) => {
      const color = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'DeepSkyBlue', 'PURPLE',]
      return color[i]
    };
    const sendBook = async () => {
      const check = await checkBook()
      if (!check) {
        return false
      }
      try {
        let genresIdArray = genres.value.map(genre => genre.id)
        const bookData = {...book.value, genres: genresIdArray}
        await updateBook(bookData)
        await router.replace('/book')
      } catch (e) {
        console.log({sendBook: e, genres: genres.value})
      }
    };
    const loadFiles = (e) => {
      for (const file of e) {
        files.value.push({name: file.name, status: null, file: file})
      }
    };
    const deleteAllFiles = async() => {
      try {
        await deleteFiles(book.value.id)
        files.value.splice(0, files.value.length)
      } catch (e) {
        console.log({deleteAllFiles: e})
      }
    };
    const checkType = (media) => {
      const type = media.file ? media.file.type : media.type
      if (type === 'image/png' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/webp') {
        return 'image'
      } else if (type === 'video/webm' || type === 'video/mp4') {
        return 'video'
      } else if (type === 'audio/mpeg') {
        return 'audio'
      } else if (type === '') {
        return 'file'
      }
    };
    const deleteOneFile = async(fileIndex) => {
      try {
        await deleteFile(files.value[fileIndex].id);
        files.value.splice(fileIndex, 1)
      } catch (e) {
        console.error({deleteFile: e})
      }
    };
    const sendFiles = async(fileToUpload) => {
      try {
        const fileArray = fileToUpload ? [fileToUpload.file] : files.value.filter(item => item.file).map(fileObject => fileObject.file)
        console.log({sendFiles: fileToUpload, fileArray: fileArray})
        const results = await uploadFiles(fileArray, book.value.id)
        for (const item of results) {
          if (item.status === 'fulfilled') {
            const fileIndex = files.value.findIndex(element => element.name === item.value.full_name)
            if (fileIndex > -1) {
              files.value.splice(fileIndex, 1)
            }
            files.value.push({...item.value, name: item.value.full_name, status: item.status})
          } else if (item.status === 'rejected') {
            const fileIndex = files.value.findIndex(element => element.name === item.value.full_name)
            files.value[fileIndex].status = 'rejected'
            files.value[fileIndex].error = item.value
          }
        }
      } catch (e) {
        console.log({sendFiles: e})
      }
    };
    const errorImage = (e) => {
      e.onerror = null
      e.target.src = '/icons/book-dead-solid.svg'
    };
    const getBook = async () => {
      if (!route.params.id) {
        return null;
      }
      try {
        const result = await loadBook(+route.params.id)
        book.value = {...result, ad: !!result.ad}
        files.value.push(...result.files.map(file => {
          return {...file, status: null}
        }))
        genres.value = [...result.genres]
      } catch (e) {
        console.log({getBook: e})
      }
    };
    getBook();

    return {
      showGenreBookModal,
      files,
      book,
      genres,
      editorMode,
      expandText,
      expandIllustration,
      adAccess,
      isDesktop,
      setGenres,
      colorizeGenre,
      toggleEditor,
      resetBook,
      errorImage,
      openGenreModal,
      checkType,
      sendBook,
      deleteAllFiles,
      deleteOneFile,
      sendFiles,
      getBook,
      loadFiles,
    }
  },
  methods: {
    autoResize() {
      const editor = this.$refs.editor
      const scrollHeight = Math.max(
          document.body.scrollHeight, editor.scrollHeight,
          document.body.offsetHeight, editor.offsetHeight,
          document.body.clientHeight, editor.clientHeight
      ) + 100;
      editor.style.cssText = `height: ${scrollHeight}px`;
    },
    getSrc(media) {
      const loaded = !!media.id
      return loaded ? `${process.env.VUE_APP_API_URL}/${media.url}` : window.URL.createObjectURL(media.file);
    },
    async copyFileName(file) {
      if (['image/webp', 'image/png', 'image/jpeg'].includes(file.type)) {
        await navigator.clipboard.writeText(`<img class="media picture" src="APIURL/${file.url}">`)
      } else if (['video/webm', 'video/mp4'].includes(file.type)) {
        await navigator.clipboard.writeText(`<video class="media video" autoplay loop muted controls><source src="APIURL/${file.url}"/></video>`)
      } else if (file.type === 'audio/mp4') {
        await navigator.clipboard.writeText(`<audio class="media audio" controls><source src="APIURL/${file.url}"/></audio>`)
      }
    },
    async formatText(type) {
      if (type === 'caret') {
        this.book.text = this.book.text.replace(/\n/g, '<p>')
      } else if (type === 'double-p') {
        this.book.text = this.book.text.replace(/<p><p>/g, '<p>')
      } else if (type === 'comment') {
        let selectionText = this.$refs.editor.value.substring(this.$refs.editor.selectionStart, this.$refs.editor.selectionEnd);
        if (selectionText.includes('<!-- ') && selectionText.includes(' -->')) {
          selectionText = selectionText.replace('<!-- ', '');
          selectionText = selectionText.replace(' -->', '');
        } else {
          selectionText = '<!-- ' + selectionText + ' -->'
        }

        this.$refs.editor.setRangeText(selectionText)
      }
    },

  },
  updated() {
    this.autoResize()
  }
}
</script>

<style scoped lang="scss">
.edit-book {
  height: calc(100% - 3.5rem);
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-flow: row;

  .header {
    width: 100%;
    margin-bottom: 2rem;
  }

  .section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex-flow: column nowrap;

    .label, .ml {
      margin-right: 1rem;
      flex: 1;
    }

    .label:last-of-type, .ml:last-of-type {
      margin-right: 0;
    }
  }

  .section.row {
    flex-flow: row nowrap;
  }

  .section, .label {
    //margin-bottom: 1rem;
  }

  .label-header {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
  }

  .section.genre {
    cursor: pointer;
    margin-bottom: 1rem;
  }

  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .value {
    padding: 0.3rem;
    width: 100%;
    color: var(--text1);
    background-color: var(--surface2);
    outline: none;
  }

  .action-bar {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .text-container {
    width: 800px;
    margin-right: 1rem;

    .ml {
      background-color: var(--surface2);
      margin-bottom: 1rem;
    }

    .ml-head {
      position: absolute;
      top: -13px;
      left: 13px;
      padding: 0 3px;
      background-color: var(--surface2);
      border-radius: 5px;
    }

    .ml-value {
      width: 100%;
      outline: none;
      border: none;
      background: inherit;
      padding: 5px;
      color: var(--color);
    }

    .description {
      flex-grow: 1;
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
        :first-child {
          margin-right: 1rem;
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
      color: var(--text1);
      background-color: var(--surface4);
    }

    .fieldset {
      width: 100%;
      margin-bottom: 1rem;

      .select {
        flex: 1;
        margin-right: 1rem;
      }
    }


    .annotation {
      width: 100%;
      flex-grow: 1;
      //margin-right: 1rem;
    }

    .name {
      flex: 1;
    }

    .rating {
      width: 150px;
      flex-direction: column;
    }

    .select {
      width: initial;
      cursor: pointer;
      padding: 0.3rem;
    }

    .editor {
      width: 100%;
      color: var(--text1);
      background-color: var(--surface2);
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
      resize: vertical;
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

  .genre-span {
    margin-right: 0.3rem;
    cursor: pointer;
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

    /* Hide default HTML checkbox */
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    /* The slider */
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

    /* Rounded sliders */
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
    outline: none;

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

  .media.video {
  }

  .media.audio {
    width: 100%;
  }

  .toggle-button {
    height: 1.5rem;
    width: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    color: var(--color);
    background-color: var(--background-2);
    cursor: pointer;
    border: 1px solid var(--color-p);
    border-radius: 4px;

    .icon {
      fill: var(--color-p);
    }
  }

  .footer {
    width: 100%;
    height: 2rem;
  }
}


@media only screen and (max-width: 892px) {
  .edit-book {
    padding: 0.5rem;
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
      .fieldset {
        .select {
          margin-right: 0.5rem;
        }

        .select:last-of-type {
          margin-right: 0;
        }
      }

      .zone {
        .search-text {
          padding: 0.3rem;
          margin-right: 0.5rem;
        }
      }

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

      .description {
      }
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

      .zone {
        max-width: 265px;

        .search-text {
          margin-right: 0;
        }

        .zone-selected {
          display: none;
        }
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
}
</style>