import {computed, inject, ref,} from 'vue'
import {goPage, loadBooks} from "../utils/loadData";
import {API_URL} from '../../runtimeEnv';
import {BookData, QueryData, BookLink, Book, FormFilter} from "../interfaces/book";

export default function useBooks() {
    let debTimer: number | undefined = undefined
    const toggleLoader = inject('toggleLoader') as Function
    const emptyGenre = ref({id: 0, name: '', description: '', ad: false, created_at: 0, category: {id: 0, name: ''}});
    const queryData = ref<QueryData>(
        {
            genre: emptyGenre.value,
            rating: 0,
            ad: undefined,
            searchQuery: undefined,
            limit: 12,
            page: 1,
            orderBy: 'updated_at',
            ascending: false
        }
    );
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
    const method = ref('push')

    function calcPaginator() {
        let arr = [];
        for (let i = queryData.value.page; i > 0 && i > queryData.value.page - 5; i--) {
            arr.unshift(i)
        }
        for (let i = queryData.value.page + 1; i <= books.value!._meta.pageCount && arr.length < 9; i++) {
            arr.push(i)
        }
        const decimalPages = Math.floor(books.value!._meta.pageCount / 10)
        for (let i = 1; i <= decimalPages; i++) {
            const decimal = Number(i + '0')
            if (decimal > queryData.value.page + 4) {
                arr.push(decimal)
            }
        }
        paginator.value = arr
    }

    const saveQuery = function () {
        localStorage.setItem('query-books', JSON.stringify(queryData.value));
    }
    const loadQuery = function () {
        const query = localStorage.getItem('query-books')
        if (query) {
            queryData.value = JSON.parse(query)
        }
    }
    function clearQuery() {
        localStorage.removeItem('query-books')
    }

    const filterCount = computed(() => {
        let count = 0
        if (Number.isInteger(queryData.value!.ad)) count++
        if (Number.isInteger(queryData.value!.genre?.id)) count++
        if (Number.isInteger(queryData.value!.rating)) count++
        return count
    })
    const getBooksAndReplace = async () => {
        const sort = `${queryData.value.ascending ? '' : '-'}${queryData.value.orderBy}`
        const formFilter: FormFilter = {
            genre_id: queryData.value.genre?.id ? queryData.value.genre.id : undefined,
            rating: queryData.value.rating ? queryData.value.rating : undefined,
            ad: queryData.value.ad ?? undefined,
            searchQuery: queryData.value.searchQuery
        }
        try {
            toggleLoader(true)
            const result = await loadBooks(queryData.value.page, queryData.value.limit, sort, formFilter);
            toggleLoader(false);
            books.value!._links = result._links
            books.value!._meta = result._meta
            books.value!.items.splice(0, books.value!.items.length)
            books.value!.items.push(...result.items)
            queryData.value.page = result._meta.currentPage
            pagBtnArr.value = Array.from({length: result._meta.pageCount}, (v, k) => k + 1);
            calcPaginator();
        } catch (e) {
            toggleLoader(false)
            console.log({'getBooksAndReplace': e})
        }
    };
    const getBooksAndPush = async (method = '') => {
        const sort = `${queryData.value.ascending ? '' : '-'}${queryData.value.orderBy}`
        const formFilter: FormFilter = {
            genre_id: queryData.value.genre?.id ? queryData.value.genre.id : undefined,
            rating: queryData.value.rating ? queryData.value.rating : undefined,
            ad: queryData.value.ad ?? undefined,
            searchQuery: queryData.value.searchQuery
        }
        if (!infinityState.value && method) {
            return false
        } else if (!method) {
            infinityState.value = true
        }

        toggleLoader(true)
        const result = await loadBooks(queryData.value.page, queryData.value.limit, sort, formFilter);
        toggleLoader(false)
        if (result) {
            if (method === 'push' && books.value.items.length) {
                books.value?.items.push(...result.items)
                queryData.value.page = ++queryData.value.page
            } else {
                books.value?.items.splice(0, books.value.items.length)
                books.value?.items.push(...result.items)
                queryData.value.page = ++queryData.value.page
            }
            if (result.items.length < queryData.value.limit || result._meta.totalCount === result.items.length) {
                infinityState.value = false
            }
        }
    };
    const toPage = async (url: BookLink) => {
        try {
            toggleLoader(true)
            books.value = await goPage(url.href);
            queryData.value.page = books.value?._meta.currentPage
            toggleLoader(false)
            calcPaginator();
        } catch (e) {
            console.log({'goPage': e})
        }
    };
    const setPageNumber = function (item: number) {
        queryData.value.page = item
        getBooksAndReplace();
    }
    const resetTable = () => {
        if (queryData.value) {
            queryData.value.genre = {
                id: 0,
                name: '',
                description: '',
                ad: false,
                created_at: 0,
                category: {id: 0, name: ''}
            }
            queryData.value.rating = 0
            queryData.value.ad = undefined
            getBooksAndReplace()
        }
    };
    const updateFilterPage = (newFilter: QueryData) => {
        if (queryData.value) {
            queryData.value.genre = newFilter.genre ? newFilter.genre : emptyGenre.value
            if (newFilter?.rating) {
                queryData.value.rating = newFilter.rating
            }
            queryData.value.ad = newFilter.ad
            queryData.value.limit = newFilter.limit
            getBooksAndReplace()
        }

    };
    const sortBy = (column: string) => {
        queryData.value.ascending = !queryData.value.ascending
        queryData.value.orderBy = column
        saveQuery()
        getBooksAndReplace();
    };
    const getCover = (book: Book) => {
        if (book.cover_path) {
            return `${API_URL}/${book.cover_path}`
        } else return '/icons/svg/book-dead-solid.svg'
    };
    const debounceGetBooksAndReplace = () => {
        if (debTimer) {
            clearTimeout(debTimer)
            debTimer = setTimeout(() => getBooksAndReplace(), 500);
        } else {
            debTimer = setTimeout(() => getBooksAndReplace(), 500);
        }
    }

    return {
        queryData,
        books,
        pagBtnArr,
        infinityState,
        filterCount,
        paginator,
        method,
        setPageNumber,
        saveQuery,
        loadQuery,
        clearQuery,
        getCover,
        resetTable,
        updateFilterPage,
        sortBy,
        toPage,
        getBooksAndReplace,
        getBooksAndPush,
        debounceGetBooksAndReplace
    }
}