import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthorStore } from '@/store/authorStore';
import { dataRequest, fetchData, getRequest, getUrl } from '@/utils/helper';
import type { Author, QueryAuthor, AuthorResponse } from '@/interfaces/author';
import type { BaseQuery, ListMeta } from '@/interfaces/meta';

export function useAuthor() {
	const route = useRoute();
	const authorStore = useAuthorStore();
	const authorDialog = ref<InstanceType<typeof HTMLDialogElement>>();
	const author = ref<Partial<Author>>();
	const authors = ref<Author[]>();
	const authorsMeta = ref<ListMeta>();
	const queryAuthors = ref<QueryAuthor>({
		id: undefined,
		name: undefined,
		url: undefined,
		page: 1,
		perPage: window.innerHeight > 1000 ? 20 : 10,
		sort: 'id',
	});

	async function getAuthors(query?: BaseQuery) {
		try {
			const url = getUrl(`${import.meta.env.VITE_BACKEND_URL}/api/author`, {
				...queryAuthors.value,
				...query,
			});
			const request = getRequest(url);
			const data = await fetchData<AuthorResponse>(request);
			authors.value = data.items;
			authorsMeta.value = data._meta;
			authorStore.setAuthors(data.items);
		} catch (error) {
			console.log('getAuthors wrong', { error: error });
		}
	}

	async function updateAuthor(authorData: Partial<Author>) {
		try {
			const method = authorData.id ? 'PUT' : 'POST';
			const url =
			authorData.id
					? new URL(`${import.meta.env.VITE_BACKEND_URL}/api/author/update?id=${authorData.id}`)
					: new URL(`${import.meta.env.VITE_BACKEND_URL}/api/author/create`);

			const request = dataRequest(url, method, { name: authorData?.name, url: authorData?.url });
			const data = await fetchData<Author>(request);
			if (authors.value) {
				const authorIndex = authors.value.findIndex((item) => item.id === data.id);
				if (authorIndex > -1) {
					authors.value[authorIndex] = data
				} else {
					authors.value.push(data);
				}
			}
			closeDialog();
		} catch (error) {
			console.log({ 'updateAuthor wrong': error });
		}
	}

	function changeSort(field: string) {
		queryAuthors.value.page = 1;
		const desc = queryAuthors.value.sort[0] === '-';
		queryAuthors.value.sort = `${desc ? '' : '-'}${field}`;
		getAuthors();
	}

	function openAuthorDialog(authorData?: Author) {
		if(authorData) {
			author.value = authorData
		}
		authorDialog.value?.showModal();
	}

	function closeDialog() {
		if (authorDialog.value) {
			authorDialog.value.close();
			author.value = undefined;
		}
	}

	async function parseQueryAuthorParams() {
		const { id, name, url, sort, page, perPage } = route.query;
		if (id) queryAuthors.value.id = Number(id);
		if (name) queryAuthors.value.name = String(name);
		if (url) queryAuthors.value.url = String(url);
		if (sort) queryAuthors.value.sort = String(sort);
		if (page) queryAuthors.value.page = Number(page);
		if (perPage) queryAuthors.value.perPage = Number(perPage);
	}

	return {
		authorDialog,
		author,
		authors,
		authorsMeta,
		queryAuthors,
		getAuthors,
		updateAuthor,
		changeSort,
		openAuthorDialog,
		closeDialog,
		parseQueryAuthorParams,
	};
}
