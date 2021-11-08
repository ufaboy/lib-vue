import {inject, ref} from "vue";
import {loadBook} from "@/utils/loadData";
import router from "@/router";

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
    const rawText = ref({})
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
    const downloadBook = async function(id) {
        loader.show();
        const result = await loadBook(id)
        loader.hide();
        const comicsBook = result.genres.findIndex(genre => genre.categoryid === 3) > -1
        typeBook.value = comicsBook ? 'BookMedia' : 'BookText'
        if (!comicsBook) {
            book.value = await prepareUrlForMedia(result)
            rawText.value = book.value.text
        } else {
            book.value = result
        }
        return book.value
    }
    return {rawText, book, typeBook, downloadBook, openBook}
}