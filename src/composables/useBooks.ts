import {Loader} from '../plugins/loader';
import {computed, inject, ref,} from 'vue'
import {goPage, loadBooks} from "../utils/loadData";
import {API_URL} from '../../runtimeEnv';
import {BookData, Filter, BookLink, Book, FormFilter} from "../interfaces/book";

export default function useBooks() {
    // @ts-expect-error
    const loader: Loader = inject("loader");
    const filter = ref<Filter>(
        {
            name: '',
            genre: {id: 0, name: '', description: '', ad: false, created_at: 0, category: {id: 0, name: ''}},
            rating: 0,
            ad: undefined,
            searchQuery: ''
        }
    );
    const searchQuery = ref('');
    const limit = ref<number>(10);
    const orderBy = ref({name: 'updated_at', asc: false});
    const page = ref<number>(1);
    const pagBtnArr = ref<Array<number>>();
    const infinityState = ref(true);
    const books = ref<BookData>({
        items: [],
        _links: {
            first: {href: ''},
            last: {href: ''},
            next: {href: ''},
            self: {href: ''},
            prev: {href: ''},
        },
        _meta: {
            currentPage: 0,
            pageCount: 0,
            perPage: 0,
            totalCount: 0
        }

    })
    const paginator = ref<Array<number>>();

    function calcPaginator() {
        let arr = [];
        for (let i = page.value; i > 0 && i > page.value - 5; i--) {
            arr.unshift(i)
        }
        for (let i = page.value + 1; i <= books.value!._meta.pageCount && arr.length < 9; i++) {
            arr.push(i)
        }
        const decimalPages = Math.floor(books.value!._meta.pageCount / 10)
        for (let i = 1; i <= decimalPages; i++) {
            const decimal = Number(i + '0')
            if (decimal > page.value + 4) {
                arr.push(decimal)
            }
        }
        paginator.value = arr
    }

    const saveOrderBy = function () {
        localStorage.setItem('orderby-books', JSON.stringify(orderBy.value));
    }
    const loadOrderBy = function () {
        const data = localStorage.getItem('orderby-books')
        if (data) {
            orderBy.value = JSON.parse(data)
        }
    }

    const filterCount = computed(() => {
        let count = 0
        if (Number.isInteger(filter.value!.ad)) count++
        if (Number.isInteger(filter.value!.genre?.id)) count++
        if (Number.isInteger(filter.value!.rating)) count++
        return count
    })
    const getBooksAndReplace = async () => {
        const sort = `${orderBy.value.asc ? '' : '-'}${orderBy.value.name}`
        const formFilter: FormFilter = {
            name: filter.value.name ? filter.value.name : undefined,
            genre: filter.value.genre?.id ? filter.value.genre.id : undefined,
            rating: filter.value.rating ? filter.value.rating : undefined,
            ad: filter.value.ad ? true : filter.value.ad === undefined ? undefined : false,
            searchQuery: searchQuery.value
        }
        try {
            loader.show();
            const result = await loadBooks(page.value, limit.value, sort, formFilter);
            loader.hide();
            books.value!._links = result._links
            books.value!._meta = result._meta
            books.value!.items.splice(0, books.value!.items.length)
            books.value!.items.push(...result.items)
            page.value = result._meta.currentPage
            pagBtnArr.value = Array.from({length: result._meta.pageCount}, (v, k) => k + 1);
            calcPaginator();
        } catch (e) {
            console.log({'getBooksAndReplace': e})
        }
    };
    const getBooksAndPush = async (method = '') => {
        const sort = `${orderBy.value.asc ? '' : '-'}${orderBy.value.name}`
        const formFilter: FormFilter = {
            name: filter.value.name ? filter.value.name : undefined,
            genre: filter.value.genre?.id ? filter.value.genre.id : undefined,
            rating: filter.value.rating ? filter.value.rating : undefined,
            ad: filter.value.ad ? true : filter.value.ad === undefined ? undefined : false,
            searchQuery: searchQuery.value
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
            if (method === 'push' && books.value.items.length) {
                books.value?.items.push(...result.items)
                page.value = ++page.value
            } else {
                books.value?.items.splice(0, books.value.items.length)
                books.value?.items.push(...result.items)
                page.value = ++page.value
            }
            if (result.items.length < limit.value) {
                infinityState.value = false
            }
        }
    };
    const toPage = async (url: BookLink) => {
        try {
            loader.show();
            books.value = await goPage(url.href);
            page.value = books.value?._meta.currentPage
            loader.hide();
            calcPaginator();
        } catch (e) {
            console.log({'goPage': e})
        }
    };
    const setPageNumber = function (item: number) {
        page.value = item
        getBooksAndReplace();
    }
    const resetTable = () => {
        if (filter.value) {
            filter.value.genre = {
                id: 0,
                name: '',
                description: '',
                ad: false,
                created_at: 0,
                category: {id: 0, name: ''}
            }
            filter.value.rating = 0
            filter.value.ad = undefined
            getBooksAndReplace()
        }
    };
    const updateFilterPage = (newFilter: Filter) => {
        if (filter.value) {
            if (newFilter?.genre) {
                filter.value.genre = newFilter.genre
            }
            if (newFilter?.rating) {
                filter.value.rating = newFilter.rating
            }
            filter.value.ad = newFilter.ad
            getBooksAndReplace()
        }

    };
    const sortBy = (column: string) => {
        orderBy.value.asc = !orderBy.value.asc
        orderBy.value.name = column
        saveOrderBy()
        getBooksAndReplace();
    };
    const getCover = (book: Book) => {
        if (book.cover_path) {
            return `${API_URL}/${book.cover_path}`
        } else return '/icons/svg/book-dead-solid.svg'
    };


    return {
        filter,
        searchQuery,
        limit,
        orderBy,
        books,
        page,
        pagBtnArr,
        infinityState,
        filterCount,
        paginator,
        setPageNumber,
        saveOrderBy,
        loadOrderBy,
        getCover,
        resetTable,
        updateFilterPage,
        sortBy,
        toPage,
        getBooksAndReplace,
        getBooksAndPush,
    }
}