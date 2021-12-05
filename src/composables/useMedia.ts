import {computed, inject, ref} from "vue";
import {loadMediaFiles} from "../utils/loadData";
import {attachFileToBook, deleteFileByName} from "../utils/uploadData";
import {API_URL} from '../../runtimeEnv';
import { ActiveMedia, BookDirFile, BookDirFiles } from "../interfaces/book";

export default function useMedia() {
// @ts-expect-error
const loader: Loader = inject("loader");
    const directories = ref<BookDirFiles[]>([])
    const activeDirIndex = ref(0);
    const activeMedia = ref<ActiveMedia>({
        full_name: '',
        type: '',
        url: ''
    });

    const calcUrl = function (file:BookDirFile) {
        return `${API_URL}/${file.url}`
    }
    const activeDir = computed(() => {
        return directories.value.length && Number.isInteger(activeDirIndex.value) ? directories.value[activeDirIndex.value].files : []
    })
    const openMedia = function (file:BookDirFile) {
        activeMedia.value = {
            full_name: file.full_name,
            url: calcUrl(file),
            type: file.type.includes('image') ? 'image' : file.type.includes('video') ? 'video' : file.type.includes('audio') ? 'audio' : ''
        }
    }
    const getMediaFiles = async function () {
        loader.show();
        directories.value = await loadMediaFiles()
        loader.hide();
    }
    const attachFile = async function (bookId: number, name:string, index:number) {
        const result = await attachFileToBook(bookId, name)
        if (result) {
            directories.value[activeDirIndex.value].files[index] = {...result}
        }
    }
    const deleteFileFromStorage = function (directory:string, name:string, index:number) {
        deleteFileByName(directory, name).then(()=>{
            return directories.value[activeDirIndex.value].files.splice(index, 1)
        }).catch(()=>{
            return false

        })
    }

    return {directories, activeDirIndex, activeMedia, calcUrl, activeDir, openMedia, getMediaFiles, attachFile, deleteFileFromStorage}
}