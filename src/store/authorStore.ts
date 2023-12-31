import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Author } from '@/interfaces/author';

export const useAuthorStore = defineStore('author', () => {
	const authors = ref<Author[]>();

	function setAuthors(data: Author[]) {
		authors.value = data;
	}

	return { authors, setAuthors };
});
