import {inject, ref,} from 'vue'
import {Genre, GenreForm} from '../interfaces/genre';
import {loadGenres} from "../utils/loadData";

export default function useGenres() {
    const toggleLoader = inject('toggleLoader') as Function
    const genreModal = ref<InstanceType<typeof HTMLDialogElement>>()
    const showGenreModal = ref(false)
    const genres = ref<Genre[]>([{
        id: 0,
        name: '',
        ad: false,
        created_at: 0,
        description: '',
        category: {id: 0, name: ''},
    }]);
    const ascending = ref(true);
    const orderBy = ref('');
    const activeGenre = ref<GenreForm>({
        id: 0,
        name: '',
        description: '',
        category_id: 0,
        ad: false
    });
    const openRow = (row: GenreForm) => {
        activeGenre.value = row
        showGenreModal.value = true
        genreModal.value?.showModal()
    }
    const createGenre = () => {
        activeGenre.value = {
            id: 0,
            name: '',
            description: '',
            category_id: 0,
            ad: false
        };
        showGenreModal.value = true
        genreModal.value?.showModal()
    }
    const closeDialog = () => {
        genreModal.value?.close()
        showGenreModal.value = false
    }

    async function getGenres() {
        try {
            toggleLoader(true);
            const result = await loadGenres()
            toggleLoader(false);
            genres.value = result
        } catch (e) {
            console.log('error', e)
            toggleLoader(false);
        }
    }

    const sortBy = (orderBy: string, asc: boolean) => {
        genres.value?.sort(function (a, b) {
            if (a[orderBy] > b[orderBy]) {
                return asc ? 1 : -1;
            }
            if (a[orderBy] < b[orderBy]) {
                return asc ? -1 : 1;
            }

            return 0;
        })
        ascending.value = !ascending.value
    }


    return {
        genres,
        ascending,
        orderBy,
        genreModal,
        showGenreModal,
        closeDialog,
        activeGenre,
        openRow,
        createGenre,
        getGenres,
        sortBy
    }
}