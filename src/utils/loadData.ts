import {$get, $goPage} from "./superFetch";
import {Book, BookDirFiles, FormFilter} from "../interfaces/book";
import {CategoryExtended} from "../interfaces/category";
import {BookData} from "../interfaces/book";
import {API_URL} from "../../runtimeEnv";
import {Author} from "../interfaces/author";

async function loadCategories(name?: string): Promise<CategoryExtended[]> {
    const url = new URL(`${API_URL}/category`);
    if (name) {
        url.searchParams.append('name', name);
    }
    return await $get(url)
}

async function loadGenres(name?: string, orderBy: string = 'created_at') {
    const url = new URL(`${API_URL}/genre`);
    Object.entries({orderBy, name}).forEach(([key, value]) => {
        if (value !== undefined) {
            url.searchParams.append(key, value.toString());
        }
    })
    return await $get(url);
}

async function loadBooks(page: number = 1, limit: number = 10, sort: string = '-id', filter: FormFilter): Promise<BookData> {
    const url = new URL(`${API_URL}/book`);
    Object.entries({page, limit, sort, ...filter,}).forEach(([key, value]) => {
        if (value !== undefined) {
            if (key === 'ad') {
                value = value ? 1 : 0
            }
            url.searchParams.append(key, value.toString());
        }
    });
    return await $get(url);
}

async function loadBook(bookId: number): Promise<Book> {
    return await $get(new URL(`${API_URL}/book/view?id=${bookId}`));
}

async function loadNotes(): Promise<{ text: string; }> {
    return await $get(new URL(`${API_URL}/book/view?id=1`));
}

async function goPage(page: string) {
    return await $goPage(new URL(page));
}

async function loadMediaFiles(): Promise<BookDirFiles[]> {
    return await $get(new URL(`${API_URL}/media-storage/media-manager`));
}

async function loadAuthors(name?: string, orderBy: string = 'created_at'): Promise<Author[]> {
    const url = new URL(`${API_URL}/author`);
    Object.entries({orderBy, name}).forEach(([key, value]) => {
        if (value !== undefined) {
            url.searchParams.append(key, value.toString());
        }
    })
    return await $get(url);
}

export {loadCategories, loadGenres, loadBooks, loadBook, loadNotes, loadAuthors, goPage, loadMediaFiles};