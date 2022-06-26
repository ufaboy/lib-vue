import {inject, ref} from 'vue';
import {API_URL} from '../../runtimeEnv';
import {loadBook} from '../utils/loadData';
import {router} from '../router';
import {isMobile} from '../utils/helpers';
import {Book} from '../interfaces/book';
import {Author} from '../interfaces/author';

export default function useBook() {
    const toggleLoader = inject('toggleLoader') as Function
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
    const genreModalShow = ref(false)
    const authorData = ref<Author>({id: 0, name:'', ad: true, url: ''})

    function openBook(book: Book, type: string) {
        router.push({
            name: type === 'edit' ? 'book-edit' : isComic(book) ? 'comic-view' : 'book-view',
            params: {id: book.id}
        })
    }
    function isComic(book: Book) {
        return book.genres.findIndex(genre => genre.category.name === 'comics') > -1
    }
    const closeDialog = () => {
        // @ts-expect-error
        genreBookModal.value.close()
        genreModalShow.value = false
    }

    function openGenreModal() {
        if (isMobile()) return null;
        genreModalShow.value = true
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
    async function downloadBook(id: number) {
        toggleLoader(true)
        const result = await loadBook(id)
        toggleLoader(false)
        if (isComic(result)) {
            book.value = result
        } else {
            book.value = await prepareUrlForMedia(result)
            rawText.value = book.value.text ?? ''
        }
        return book.value
    }
    return {
        rawText,
        book,
        authorData,
        genreBookModal,
        genreModalShow,
        isComic,
        closeDialog,
        openGenreModal,
        downloadBook,
        openBook
    }
}