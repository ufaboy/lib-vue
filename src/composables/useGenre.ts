import {computed, inject, ref} from "vue";
import {sendGenre} from "../utils/uploadData";
import {getAdAccess} from "../utils/userData";
import {$delete} from "../utils/superFetch";
import {Genre, GenreForm} from "../interfaces/genre";

// @ts-expect-error
export default function useGenre(props, emit) {
    const localGenre = ref({
        id: 0,
        name: '',
        description: '',
        category: {id: 0, name: ''},
        ad: false,
    })
    if (props.genre) {
        localGenre.value = props.genre
    }
    const adAccess = getAdAccess()
    const loader = inject("loader");

    const invalidGenre = computed((): string => {
        return localGenre.value ? (!localGenre.value.name || !localGenre.value.category) ? 'Не заполнены поля' : '' : ''
    })

    const updateGenre = async () => {
        console.log('updateGenre', {invalidGenre: invalidGenre.value})
        if (invalidGenre.value) {
            return false;
        }
        let genreForm: GenreForm = {
            name: localGenre.value.name,
            description: localGenre.value.description,
            ad: localGenre.value.ad,
            category_id: localGenre.value.category.id,
        }
        if (localGenre.value.id) {
            genreForm.id = localGenre.value.id
        }
        try {
            // @ts-expect-error
            loader.show()
            await sendGenre(genreForm)
            // @ts-expect-error
            loader.hide()
            emit('update-genres')
            closeModal();
        } catch (e) {
            console.log({'error updateGenre': e})
        }
    }
    const deleteGenre = async () => {
        const url = new URL(`/genre/delete?id=${props.genre.id}`)
        const result = await $delete(url)
        if (result) {
            emit('update-genres')
            closeModal();
        }
    }
    const closeModal = () => {
        emit('hide-modal')
    }
    return {localGenre, adAccess, closeModal, updateGenre, deleteGenre}
}