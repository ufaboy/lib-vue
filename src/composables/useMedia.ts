import {computed, inject, ref} from "vue";
import {loadMediaFiles} from "../utils/loadData";
import {attachFileToBook, deleteFileByName} from "../utils/uploadData";
import {API_URL} from '../../runtimeEnv';
import { ActiveMedia, BookDirFile, BookDirFiles } from "../interfaces/book";

export default function useMedia() {
    const toggleLoader = inject('toggleLoader') as Function
    const directories = ref<BookDirFiles[]>([])
    const activeDirIndex = ref<number|undefined>();
    const activeMedia = ref<ActiveMedia>({
        full_name: '',
        type: '',
        url: ''
    });

    const calcUrl = function (file:BookDirFile) {
        return `${API_URL}/${file.url}`
    }
    const activeDir = computed(() => {
        return directories.value.length && typeof activeDirIndex.value === 'number' ? directories.value[activeDirIndex.value].files : []
    })
    const openMedia = function (file:BookDirFile) {
        activeMedia.value = {
            full_name: file.full_name,
            url: calcUrl(file),
            type: file.type.includes('image') ? 'image' : file.type.includes('video') ? 'video' : file.type.includes('audio') ? 'audio' : ''
        }
    }
    const getMediaFiles = async function () {
        toggleLoader(true)
        directories.value = await loadMediaFiles()
        toggleLoader(false)
    }
    const attachFile = async function (name:string, index:number) {
        if(typeof activeDirIndex.value === 'number') {
            // @ts-expect-error
            const bookId = directories[activeDirIndex.value].bookId as number
            const result = await attachFileToBook(bookId, name)
            if (result) {
                directories.value[activeDirIndex.value].files[index] = {...result}
            }
        }

    }
    const deleteFileFromStorage = function (name:string, index:number) {
        if(typeof activeDirIndex.value === 'number') {
            // @ts-expect-error
            const directory = directories[activeDirIndex.value].dir_name
            deleteFileByName(directory, name).then(()=>{
            const dirIndex = activeDirIndex.value as number
            return directories.value[dirIndex].files.splice(index, 1)
        }).catch(()=>{
            return false
        })
        }
        
    }

    return {directories, activeDirIndex, activeMedia, calcUrl, activeDir, openMedia, getMediaFiles, attachFile, deleteFileFromStorage}
}