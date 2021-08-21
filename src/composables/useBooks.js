import {loadBooks} from "@/utils/loadData";
import {inject, ref,} from 'vue'

export default function useBooks ()  {
    const loader = inject("loader");
    const filter = ref({
        genre: null,
        rating: null,
        ad: null,
    });
    const searchField = ref('');
    const limit = ref(10);
    const orderBy = ref({name: 'updated_at', asc: false});
    const page = ref(1);
    const pagBtnArr = ref([]);
    const books = ref({
        items: [],
        _links: {},
        _meta: {},
    });
    const getBooksAndReplace = async () => {
        const sort = `${orderBy.value.asc ? '' : '-'}${orderBy.value.name}`
        const formFilter = {genre: filter.value.genre, rating: filter.value.rating, ad: filter.value.ad, name: searchField.value}
        try {
            loader.show();
            const result = await loadBooks(page.value, limit.value, sort, formFilter);
            loader.hide();
            books.value._links = result._links
            books.value._meta = result._meta
            books.value.items.splice(0, books.value.items.length)
            books.value.items.push(...result.items)
            page.value = result._meta.currentPage
            pagBtnArr.value = Array.from({length: result._meta.pageCount}, (v, k) => k + 1);
        } catch (e) {
            console.log({'getBooksAndReplace': e})
        }
    };
    return {filter, searchField, limit, orderBy, books, page, pagBtnArr, getBooksAndReplace}
}