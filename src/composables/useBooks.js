import {goPage, loadBooks} from "@/utils/loadData";
import {computed, inject, ref,} from 'vue'

export default function useBooks() {
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
    const infinityState = ref(true);
    const books = ref({
        items: [],
        _links: {},
        _meta: {},
    });

    const filterCount = computed(()=>{
        let count = 0
        if (Number.isInteger(filter.value.ad)) count++
        if (Number.isInteger(filter.value.genre?.id)) count++
        if (Number.isInteger(filter.value.rating)) count++
        return count
    })
    const getBooksAndReplace = async () => {
        const sort = `${orderBy.value.asc ? '' : '-'}${orderBy.value.name}`
        const formFilter = {
            genre: filter.value.genre?.id,
            rating: filter.value.rating,
            ad: filter.value.ad,
            name: searchField.value
        }
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
    const getBooksAndPush = async (method = '') => {
        const sort = `${orderBy.value.asc ? '' : '-'}${orderBy.value.name}`
        const formFilter = {
            genre: filter.value.genre?.id,
            rating: filter.value.rating,
            ad: filter.value.ad,
            name: searchField.value
        }
        if (!infinityState.value && method) {
            return false
        } else if (!method) {
            infinityState.value = true
        }

        loader.show();
        const result = await loadBooks(page.value, limit.value, sort, formFilter);
        loader.hide();
        if (result) {
            if (method === 'push') {
                books.value.items.push(...result.items)
                page.value = ++page.value
            } else {
                books.value.items.splice(0, books.value.items.length)
                books.value.items.push(...result.items)
                page.value = ++page.value
            }
            if (result.items.length < limit.value) {
                infinityState.value = false
            }
        }
    };
    const toPage = async (url) => {
        try {
            loader.show();
            books.value = await goPage(url.href);
            loader.hide();
        } catch (e) {
            console.log({'goPage': e})
        }
    };
    const resetTable = () => {
        filter.value.genre = {}
        filter.value.rating = null
        filter.value.ad = null
        getBooksAndReplace()
    };
    const updateFilterPage = (newFilter) => {
        if (newFilter?.genre) {
            filter.value.genre = newFilter.genre
        }
        if (newFilter?.rating) {
            filter.value.rating = newFilter.rating
        }
        filter.value.ad = newFilter.ad === null ? null : newFilter.ad ? 1 : 0
        getBooksAndReplace()
    };
    const sortBy = (column) => {
        orderBy.value.asc = !orderBy.value.asc
        orderBy.value.name = column
        getBooksAndReplace();
    };
    const getCover = (book) => {
        if (book.cover_path) {
            return `${process.env.VUE_APP_API_URL}/${book.cover_path}`
        } else return '/img/book-dead-solid.svg'
    };


    return {
        filter,
        searchField,
        limit,
        orderBy,
        books,
        page,
        pagBtnArr,
        infinityState,
        filterCount,
        getCover,
        resetTable,
        updateFilterPage,
        sortBy,
        toPage,
        getBooksAndReplace,
        getBooksAndPush,
    }
}