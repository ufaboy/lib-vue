import { useRoute, useRouter } from 'vue-router';

export function useRoutes() {
	const route = useRoute();
	const router = useRouter();

	function updateQueryStringParameter(params: string) {
		const url = new URL(`${window.location.origin}${window.location.pathname}`);
		url.search = params;
		router.replace({ name: route.name ?? 'books', query: Object.fromEntries(url.searchParams) });
	}
	return { updateQueryStringParameter };
}
