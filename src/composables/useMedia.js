import {ref} from "vue";
import {loadMediaFiles} from "../utils/loadData";

export default function useMedia() {
    const mediaFiles = ref([])
    const getMediaFiles = async function () {
        mediaFiles.value = await loadMediaFiles()
    }

    return {mediaFiles, getMediaFiles}
}