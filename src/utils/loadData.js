import {$get, $goPage} from "./superFetch";
function loadCategories(name) {
    try {
        const url = name ? `/category?name=${name}` : '/category'
        return $get(url)
    }catch (e) {
        console.log(e)
        return Promise.reject(e)
    }
}
function loadGenres(name, orderBy = 'created_at') {
    try {
        let url = `/genre?order_by=${orderBy}`
        if (name) {
            url = `${url}&name=${name}`
        }
        return $get(url)
    }catch (e) {
        console.log(e)
        return Promise.reject(e)
    }
}
function loadBooks(page = 1, limit = 10, sort = '-id', filter = {}) {
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
    return $get(url);
}
function loadBook(bookId) {
    return $get(`/book/view?id=${bookId}`)
}
function loadNotes() {
    return $get('/book/view?id=1')
}
function goPage(page) {
    return $goPage(page)
}

export {loadCategories, loadGenres, loadBooks, loadBook, loadNotes, goPage};