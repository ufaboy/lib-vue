import {$get, $goPage} from "./superFetch";


function loadCategories(name) {
        const url = name ? `/category?name=${name}` : '/category'
        $get(url).then(result => {
            return result
        }).catch(e => {
            console.log({loadBooks: e})
        })
}

function loadGenres(name, orderBy = 'created_at') {
        let url = `/genre?order_by=${orderBy}`
        if (name) {
            url = `${url}&name=${name}`
        }
        $get(url).then(result => {
            return result
        }).catch(e => console.log({loadBooks: e}));
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
    $get(url).then(result => {
        return result
    }).catch(e => console.log({loadBooks: e}));
}

function loadBook(bookId) {
    $get(`/book/view?id=${bookId}`).then(result => {
        return result
    }).catch(e => console.log({loadBook: e}))
}

function loadNotes() {
    $get('/book/view?id=1').then(result => {
            return result
        }).catch(e => console.log({loadNotes: e}))
}

function goPage(page) {
    $goPage(page).then(result => {
        return result
    }).catch(e => console.log({goPage: e}))
}

export {loadCategories, loadGenres, loadBooks, loadBook, loadNotes, goPage};