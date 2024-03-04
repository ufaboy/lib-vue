import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRoutes } from './routes';
import { storeToRefs } from 'pinia';
import { useBookStore } from '@/store/bookStore';
import { getRequest, dataRequest, getUrl, fetchData } from '@/utils/helper';
import type { Book, BookResponse, QueryBooks } from '@/interfaces/book';
import type { ListMeta } from '@/interfaces/meta';

export function useBook() {
	const route = useRoute();
	const router = useRouter();
	const { updateQueryStringParameter } = useRoutes();
	const bookStore = useBookStore();
	const { book } = storeToRefs(bookStore);
	const books = ref<Book[]>([]);
	const booksMeta = ref<ListMeta>();
	const queryBooks = ref<QueryBooks>({
		id: undefined,
		name: undefined,
		text: undefined,
		text_length: undefined,
		tag: undefined,
		view_count: undefined,
		rating: undefined,
		authorName: undefined,
		seriesName: undefined,
		size: undefined,
		updated_at: undefined,
		last_read: undefined,
		page: 1,
		perPage: 10,
		sort: localStorage.getItem('book-sort') ?? '-updated_at',
	});
	const infinityState = ref(true);
	const loading = ref(false);

	async function getBook(id: number) {
		try {
			const url = new URL(
				`${import.meta.env.VITE_BACKEND_URL}/api/book/view?id=${id}&expand=media,author,series,tags`,
			);
			const request = getRequest(url);
			const data = await fetchData<Book>(request);
			bookStore.setBook({ ...data, tags: data.tags || [] });
		} catch (error) {
			console.log('getBook wrong', { error: error });
		}
	}

	async function getBooks(method = '') {
		try {
			if (loading.value || (!infinityState.value && method)) {
				return false;
			}
			loading.value = true;
			if (method === 'push' && books.value && books.value.length) {
				queryBooks.value.page++;
			}
			const url = getUrl(`${import.meta.env.VITE_BACKEND_URL}/api/book`, queryBooks.value);
			const request = getRequest(url);
			const data = await fetchData<BookResponse>(request);
			if (method === 'push' && books.value) {
				books.value.push(...data.items);
				if (data.items.length < queryBooks.value.perPage || data._meta.totalCount === data.items.length) {
					infinityState.value = false;
				} else infinityState.value = true;
			} else {
				books.value = data.items;
			}
			booksMeta.value = data._meta;
			updateQueryStringParameter(url.search);
			saveSortConfig();
		} catch (error) {
			console.log('getBooks wrong', { error: error });
		} finally {
			loading.value = false;
		}
	}

	function changeSort(field: string) {
		queryBooks.value.page = 1;
		const desc = queryBooks.value.sort[0] === '-';
		queryBooks.value.sort = `${desc ? '' : '-'}${field}`;
		getBooks();
	}

	function updateRouterQuery(searchParams: URLSearchParams) {
		router.replace(`/books?${searchParams.toString()}`);
	}

	async function updateBookMark(bookID: number, progress: number) {
		const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/api/book/update-bookmark?id=${bookID}`);
		const formData = new FormData();
		formData.append('bookmark', progress.toString());
		const request = dataRequest(url, 'PUT', { bookmark: progress.toString() });
		const response = await fetch(request);
		return response.json();
	}

	function isComics(book: Book) {
		return !!book.tags.find((tag) => tag.name === 'comics');
	}

	function sizeConverter(length = 0) {
		return length <= 50000 ? 'S' : length <= 300000 ? 'M' : length <= 500000 ? 'L' : 'XL';
	}

	function saveSortConfig() {
		localStorage.setItem('book-sort', queryBooks.value.sort);
	}

	function restoreSortConfig(): string {
		return (queryBooks.value.sort = localStorage.getItem('book-sort') ?? '-updated_at');
	}

	async function parseQueryBookParams() {
		const {
			id,
			name,
			text,
			text_length,
			sort,
			view_count,
			rating,
			authorName,
			seriesName,
			size,
			tag,
			updated_at,
			last_read,
			page,
			perPage,
		} = route.query;
		if (id) queryBooks.value.id = Number(id);
		if (name) queryBooks.value.name = String(name);
		if (text) queryBooks.value.text = String(text);
		if (sort) queryBooks.value.sort = String(sort);
		if (tag) queryBooks.value.tag = String(tag);
		if (authorName) queryBooks.value.authorName = String(authorName);
		if (seriesName) queryBooks.value.seriesName = String(seriesName);
		if (text_length) queryBooks.value.text_length = Number(text_length);
		if (view_count) queryBooks.value.view_count = Number(view_count);
		if (rating) queryBooks.value.rating = Number(rating);
		if (size) queryBooks.value.size = Number(size);
		if (updated_at) queryBooks.value.updated_at = Number(updated_at);
		if (last_read) queryBooks.value.last_read = Number(last_read);
		if (page) queryBooks.value.page = Number(page);
		if (perPage) queryBooks.value.perPage = Number(perPage);
	}

	return {
		book,
		books,
		booksMeta,
		queryBooks,
		infinityState,
		loading,
		isComics,
		getBook,
		getBooks,
		updateRouterQuery,
		changeSort,
		updateBookMark,
		sizeConverter,
		restoreSortConfig,
		parseQueryBookParams,
	};
}
