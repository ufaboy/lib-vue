import {computed, inject, ref} from "vue";
import {loadMediaFiles} from "../utils/loadData";
import {attachFileToBook, deleteFileByName} from "../utils/uploadData";

export default function useMedia() {
    const loader = inject("loader");
    const directories = ref([])
    const activeDirIndex = ref(null);
    const activeMedia = ref({});
    const calcUrl = function (file) {
        return `${process.env.VUE_APP_API_URL}/${file.url}`
    }
    const activeDir = computed(() => {
        return directories.value.length && Number.isInteger(activeDirIndex.value) ? directories.value[activeDirIndex.value].files : []
    })
    const openMedia = function (file) {
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
    const attachFile = async function (bookId, name, index) {
        const result = await attachFileToBook(bookId, name)
        if (result) {
            directories.value[activeDirIndex.value].files[index] = {...result}
        }
    }
    const deleteFileFromStorage = function (directory, name, index) {
        if (deleteFileByName(directory, name)) {
            return directories.value[activeDirIndex.value].files.splice(index, 1)
        }
        return false
    }

    return {directories, activeDirIndex, activeMedia, calcUrl, activeDir, openMedia, getMediaFiles, attachFile, deleteFileFromStorage}
}