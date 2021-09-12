import {computed, inject, ref} from "vue";
import {sendGenre} from "@/utils/uploadData";
import {getAdAccess} from "@/utils/userData";
import {$delete} from "@/utils/superFetch";

export default function useGenre(props, emit) {
    const localGenre = ref({
        id: null,
        name: '',
        description: '',
        category: {id: null, name: ''},
        ad: null,
    })
    if (props.genre) {
        localGenre.value = props.genre
    }
    const adAccess = getAdAccess()
    const loader = inject("loader");

    const invalidGenre = computed(() => {
        return {
            name: !localGenre.value.name,
            category: !localGenre.value.category
        }
    })

    const checkGenreToHaveErrors = () => {
        let haveErrors = false
        for (const field in invalidGenre) {
            if (invalidGenre.value[field]) {
                haveErrors = true
            }
        }
        return haveErrors
    }
    const updateGenre = async() => {
        if (checkGenreToHaveErrors()) {
            return false;
        }
        let genreForm = {
            name: localGenre.value.name,
            description: localGenre.value.description,
            ad: localGenre.value.ad,
            category_id: localGenre.value.category.id,
        }
        if (localGenre.value.id) {
            genreForm.id = localGenre.value.id
        }
        try {
            loader.show()
            await sendGenre(genreForm)
            loader.hide()
            emit('update-genres')
            closeModal();
        } catch (e) {
            console.log({'error updateGenre': e})
        }

    }
    const deleteGenre = async () => {
        const url = `/genre/delete?id=${props.genre.id}`
        const result = await $delete(url)
        if (result) {
            emit('update-genres')
            closeModal();
        }
    }
    const closeModal = () => {
        emit('hide-modal')
    }
    return {localGenre, adAccess, closeModal, checkGenreToHaveErrors, updateGenre, deleteGenre}
}