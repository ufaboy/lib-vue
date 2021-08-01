import {$get, $goPage} from "./superFetch";
async function loadDivisions(name) {
    try {
        const url = name ? `/division?name=${name}` : '/division'
        return await $get(url)
    }catch (e) {
        console.log(e)
        return Promise.reject(e)
    }
}
async function loadGenres(name, orderBy = 'created_at') {
    try {
        let url = `/genre?order_by=${orderBy}`
        if (name) {
            url = `${url}&name=${name}`
        }
        return await $get(url)
    }catch (e) {
        console.log(e)
        return Promise.reject(e)
    }
}
async function loadBooks(page = 1, limit = 10, sort = '-id', filter = {}) {
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
    if (Number.isInteger(filter.ad)) {
        url += `&ad=${filter.ad}`
    }
    return  await $get(url);
}
async function loadBook(bookId) {
    return await $get(`/book/view?id=${bookId}`)
}
async function loadNotes() {
    return await $get('/book/view?id=1')
}
async function goPage(page) {
    return await $goPage(page)
}

export {loadDivisions, loadGenres, loadBooks, loadBook, loadNotes, goPage};