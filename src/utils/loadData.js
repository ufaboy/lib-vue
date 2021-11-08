import {$get} from "./superFetch";


async function loadCategories(name) {
        const url = name ? `/category?name=${name}` : '/category'
        return await $get(url)
}

async function loadGenres(name, orderBy = 'createdAt') {
    let url = `/genre?order_by=${orderBy}`
    if (name) {
        url = `${url}&name=${name}`
    }
    return await $get(url);
}

async function loadBooks(page = 1, limit = 10, sort = '-id', filter = {}) {
    let url = `/book?page=${page}&limit=${limit}&sort=${sort}`
    if (filter.name) {
        url += `&name=${filter.name}`
    }
    if (filter.genre) {
        url += `&genreId=${filter.genre}`
    }
    if (filter.rating) {
        url += `&rating=${filter.rating}`
    }
    if (Number.isInteger(filter.ad)) {
        url += `&ad=${filter.ad}`
    }
    if (filter.searchQuery) {
        url += `&searchQuery=${filter.searchQuery}`
    }
    return await $get(url);
}

async function loadBook(bookId) {
    return await $get(`/book/view?id=${bookId}`);
}

async function loadNotes() {
    return await $get('/book/view?id=1');
}

async function loadMediaFiles() {
    return await $get('/media-storage/media-manager')
}

export {loadCategories, loadGenres, loadBooks, loadBook, loadNotes, loadMediaFiles};