import {inject, ref} from "vue";
import {loadBook} from "@/utils/loadData";
import router from "@/router";
import {checkDevice} from "../utils/helpers";

export default function useBook() {
    const loader = inject("loader");
    const book = ref({
        id: null,
        name: null,
        annotation: '',
        text: '',
        source: null,
        cover: null,
        rating: null,
        ad: false,
        cover_path: '',
        files: []
    });
    const typeBook = ref('BookEmpty')

    const openBook = (book, type) => {
        router.push({
            name: type === 'edit' ? 'book-edit' : 'book-view',
            params: {id: book.id}
        })
    };

    const prepareUrlForMedia = async (result) => {
        if (result.text) {
            const regexp = new RegExp("APIURL", "g");
            result.text = result.text.replace(regexp, process.env.VUE_APP_API_URL)
            return result
        }
        return book
    };
    const moveMedia = function(book) {
        ['picture', 'video', 'audio'].map(media => {
            const regexp = new RegExp(`class="${media}"`, "g");
            book.text = book.text.replace(regexp, `class="${media} media--right"`)
        })
        return book;
    }
    const downloadBook = async(id) => {
        loader.show();
        let result = await loadBook(id)
        loader.hide();
        const comicsBook = result.genres.findIndex(genre => genre.category.name === 'comics') > -1
        typeBook.value = comicsBook ? 'BookMedia' : 'BookText'
        if (!comicsBook) {
            book.value = await prepareUrlForMedia(result)
            console.log({checkDevice: checkDevice()})
            if (checkDevice() === 'desktop') {
                book.value = moveMedia(book.value)
            }
        } else {
            book.value = result
        }
    };

    return {book, typeBook, downloadBook, openBook}
}