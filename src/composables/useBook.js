import {inject, ref} from "vue";
import {loadBook} from "@/utils/loadData";

export default function useBook() {
    const loader = inject("loader");
    const book = ref({});
    const typeBook = ref('book-empty')

    const prepareUrlForMedia = (result) => {
        if (result.text) {
            const regexp = new RegExp("APIURL", "g");
            result.text = result.text.replace(regexp, process.env.VUE_APP_API_URL)
            return result
        }
        return book
    };
    const downloadBook = async(id) => {
        loader.show();
        let result = await loadBook(id)
        loader.hide();
        const comicsBook = result.genres.findIndex(genre => genre.category.name === 'comics') > -1
        typeBook.value = comicsBook ? 'book-media' : 'book-text'
        if (!comicsBook) {
            book.value = prepareUrlForMedia(result)
        }
    };

    return {book, typeBook, downloadBook}
}