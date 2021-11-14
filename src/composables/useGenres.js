import {inject, ref,} from 'vue'
import {loadGenres} from "../utils/loadData";

export default function useGenres() {
    const loader = inject("loader");
    const genreModal = ref(null)
    const showGenreModal = ref(false)
    const genres = ref([]);
    const ascending = ref(1);
    const orderBy = ref(null);
    const activeGenre = ref({
        id: null,
        name: null,
        description: null,
        category: {id: null, name: null},
    });
    const openRow = (row) => {
        activeGenre.value = row
        showGenreModal.value = true
        genreModal.value.showModal()
    }
    const createGenre = () => {
        activeGenre.value = ref({
            id: null,
            name: null,
            description: null,
            category: {id: null, name: null},
        });
        showGenreModal.value = true
        genreModal.value.showModal()
    }
    const closeDialog = () => {
        genreModal.value.close()
        showGenreModal.value = false
    }

    const getGenres = async () => {
        loader.show();
        const result = await loadGenres()
        loader.hide();
        if (result) {
            genres.value = result
        } else console.log({'getGenres': result})
    };
    const sortBy = (orderBy, asc) => {
        genres.value.sort(function (a, b) {
            if (a[orderBy] > b[orderBy]) {
                return asc ? 1 : -1;
            }
            if (a[orderBy] < b[orderBy]) {
                return asc ? -1 : 1;
            }
            return 0;
        })
        ascending.value = ascending.value ? 0 : 1
    }


    return {genres, ascending, orderBy, genreModal, showGenreModal, closeDialog, activeGenre, openRow, createGenre, getGenres, sortBy}
}