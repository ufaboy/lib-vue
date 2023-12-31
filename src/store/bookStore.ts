import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Book } from '@/interfaces/book';

export const useBookStore = defineStore('book', () => {
	const book = ref<Book>();
	const books = ref<Book[]>();

	function setBook(data?: Book) {
		book.value = data;
	}
	function setBooks(data: Book[]) {
		books.value = data;
	}

	return { book, books, setBook, setBooks };
});
