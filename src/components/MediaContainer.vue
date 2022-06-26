<template>
  <div class="media-container">
    <header class="header-media">
      <button @click="containerExpanded = !containerExpanded">Media</button>
    </header>
    <div class="flex" :class="{'flex-row': containerExpanded, 'flex-col': !containerExpanded}">
      <label class="upload-dropbox mr-2 mb-2 w-28">
        <span class="btn-blue flex w-full justify-center">Choose files</span>
        <input type="file"
               class="upload-input hidden desktop"
               multiple
               accept="video/webm,image/webp,audio/mpeg"
               @change="loadFiles">
      </label>
      <button class="btn-green leading-[normal] w-28 mr-2 mb-2" @click="uploadAllFiles">Upload</button>
      <button class="btn-red leading-[normal] w-28 mb-2" @click="deleteAllFiles">Remove</button>
    </div>
    <div class="media-wrapper mt-3" v-if="containerExpanded">
      <figure class="figure group relative mb-3 w-fit" v-for="(media, index) of files" :key="index">
        <div class="action-panel absolute top-1 left-0 hidden group-hover:flex z-10 w-full flex flex-row flex-wrap justify-between">
          <button class="btn text-white bg-sky-500/50 hover:bg-sky-500/75" @click="uploadSingleFile(media, index)" v-if="!media.id">
            load
          </button>
          <button class="btn text-white bg-sky-500/50 hover:bg-sky-500/75 mr-2"
                  @click="setCover(media)"
                  v-if="checkType(media) === 'image' && media.id">
            {{ getCoverBtnText(media) }}cover
          </button>
          <button class="btn text-white bg-green-500/50 hover:bg-green-500/75 mr-2" @click="copyFileName(media)"
                  v-if="media.id">tag
          </button>
          <button class="btn text-white bg-red-500/50 hover:bg-red-500/75" @click="deleteOneFile(index)" v-if="media.id">
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
    <ul v-else class="flex flex-col justify-center">
      <li class="group flex flex-row items-center p-2 mb-2 rounded shadow hover:bg-sky-100" v-for="(media, index) in files">
        <span class="mr-2">{{ getCaption(media) }}</span>
        <div class="hidden flex-row group-hover:flex">
          <button class="mr-2 group">
            <IconImageReveal class="peer" />
            <figure class="fixed top-0 left-0 right-0 bottom-0 m-auto hidden peer-hover:block w-fit h-fit">
              <img class="media image max-w-[50vw] max-h-[75vh] object-cover rounded" :src="getSrc(media)" v-if="checkType(media) === 'image'" alt="img">
              <video v-else-if="checkType(media) === 'video'" class="media video" controls>
                <source :src="getSrc(media)">
              </video>
              <figcaption class="figure-caption truncate">{{ getCaption(media) }}</figcaption>
            </figure>
          </button>
          <button class="mr-2" @click="copyFileName(media)">
            <IconCopy />
          </button>
          <button @click="deleteOneFile(index)">
            <IconClose />
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts" >
import {inject, ref, watch} from "vue";
import {BookFile, FileRaw, FileMix} from "../interfaces/book";
import {deleteFile, deleteFiles, uploadFiles} from "../utils/uploadData";
import {API_URL} from "../../runtimeEnv";
import IconClose from "./icons/IconClose.vue";
import IconImageReveal from "./icons/IconImageReveal.vue";
import IconCopy from "./icons/IconCopy.vue";

const printToast = inject('printToast') as Function
const toggleLoader = inject('toggleLoader') as Function

interface PromiseFulfilledResult {
  status: "fulfilled";
  value: BookFile;
}

interface PromiseRejectedResult {
  status: "rejected";
  reason: string;
}

type PromiseSettledResult = PromiseFulfilledResult | PromiseRejectedResult;

interface Props {
  bookFiles: BookFile[]|undefined
  bookId: number|undefined
  bookCoverPath: string|undefined
  isLoaded: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['set-cover',])

const files = ref<FileMix[]>([]);
const containerExpanded = ref(false)

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
    if (props.bookId) {
      await deleteFiles(props.bookId)
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
    toggleLoader(true)
    // @ts-expect-error
    const response = await uploadFiles(fileArray, book.value.id)
    toggleLoader(false)
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
      toggleLoader(true)
      // @ts-expect-error
      const response = await uploadFiles(fileArray, book.value.id)
      toggleLoader(false)

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
  emit('set-cover', fileData.url)
}

function getCoverBtnText(media: FileMix) {
  const fileData = media as BookFile
  props.bookCoverPath === fileData.url ? 'current' : 'set'
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
watch(() => props.isLoaded, newValue => {
  if (newValue) {
    if (props.bookFiles?.length) {
      (files.value as FileMix[]).push(...props.bookFiles.map(file => {
        return {...file, status: ''}
      }))
    }
  }
})
</script>

<style lang="scss">

</style>