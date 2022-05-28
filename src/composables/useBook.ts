import {inject, ref} from "vue";
import {API_URL} from '../../runtimeEnv';
import {loadBook} from "../utils/loadData";
import {router} from "../router/index";
import {isMobile} from "../utils/helpers";
import {Book} from "../interfaces/book";
import {Author} from "../interfaces/author";

export default function useBook() {
// @ts-expect-error
    const loader: Loader = inject("loader");
    const book = ref<Book>({
        id: 0,
        name: '',
        annotation: '',
        text: '',
        book_type: '',
        source: '',
        bookmark: 0,
        rating: 0,
        ad: false,
        author: {id: 0, name:'', ad: true, url: ''},
        genres: [],
        cover_path: '',
        files: [],
        view_count: 0,
        created_at: 0,
        updated_at: 0,
        last_read: 0,
    });
    const rawText = ref('')
    const typeBook = ref('BookEmpty')
    const genreBookModal = ref<InstanceType<typeof HTMLElement>>()
    const showGenreBookModal = ref(false)
    const authorData = ref<Author>({id: 0, name:'', ad: true, url: ''})
    const openBook = (book: Book, type: string) => {
        router.push({
            name: type === 'edit' ? 'book-edit' : 'book-view',
            params: {id: book.id}
        })
    };
    const closeDialog = () => {
        // @ts-expect-error
        genreBookModal.value.close()
        showGenreBookModal.value = false
    }

    function openGenreModal() {
        showGenreBookModal.value = !isMobile()
        // @ts-expect-error
        genreBookModal.value?.showModal()
    }

    const prepareUrlForMedia = async (result: Book) => {
        if (result.text) {
            const regexp = new RegExp("APIURL", "g");
            result.text = result.text.replace(regexp, API_URL)
            return result
        }
        return result
    };
    const downloadBook = async function (id: number) {
        loader.show();
        const result = await loadBook(id)
        loader.hide();
        const comicsBook = result.genres.findIndex(genre => genre.category.name === 'comics') > -1

        if (!comicsBook) {
            book.value = await prepareUrlForMedia(result)
            rawText.value = book.value.text ?? ''
        } else {
            book.value = result
        }

        typeBook.value = comicsBook ? 'BookMedia' : 'BookText'
        return book.value
    }
    return {
        rawText,
        book,
        authorData,
        typeBook,
        genreBookModal,
        showGenreBookModal,
        closeDialog,
        openGenreModal,
        downloadBook,
        openBook
    }
}