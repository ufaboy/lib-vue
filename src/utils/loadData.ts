import {$get, $goPage} from "./superFetch";
import {Book, BookDirFiles, FormFilter} from "../interfaces/book";
import {CategoryExtended} from "../interfaces/category";
import { BookData } from "../interfaces/book";


async function loadCategories(name?:string): Promise<CategoryExtended[]> {
        const url = name ? `/category?name=${name}` : '/category'
        return await $get(url)
}

async function loadGenres(name?:string, orderBy:string = 'created_at') {
    let url = `/genre?order_by=${orderBy}`
    if (name) {
        url = `${url}&name=${name}`
    }
    return await $get(url);
}

async function loadBooks(page:number = 1, limit:number = 10, sort:string = '-id', filter:FormFilter): Promise<BookData> {
    let url = `/book?page=${page}&limit=${limit}&sort=${sort}`
    if (filter.name) {
        url += `&name=${filter.name}`
    }
    if (filter.genre) {
        url += `&genre_id=${filter.genre}`
    }
    if (filter.rating) {
        url += `&rating=${filter.rating}`
    }
    if (filter.ad !== undefined) {
        url += `&ad=${filter.ad ? 1 : 0}`
    }
    if (filter.searchQuery) {
        url += `&searchQuery=${filter.searchQuery}`
    }
    return await $get(url);
}

async function loadBook(bookId:number):Promise<Book> {
    return await $get(`/book/view?id=${bookId}`);
}

async function loadNotes():Promise<{ text: string; }> {
    return await $get('/book/view?id=1');
}

async function goPage(page:string) {
    return await $goPage(page);
}

async function loadMediaFiles():Promise<BookDirFiles[]> {
    return await $get('/media-storage/media-manager')
}

export {loadCategories, loadGenres, loadBooks, loadBook, loadNotes, goPage, loadMediaFiles};