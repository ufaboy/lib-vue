import {$post, $patch, $delete} from "@/utils/superFetch";

function sendGenre(genreForm) {
    if (genreForm.id) {
        $patch(`/genre/update?id=${genreForm.id}`, genreForm).then(result => {
            return result
        }).catch(e => console.log({updateGenre: e}))
    } else {
        $post(`/genre/create`, genreForm).then(result => {
            return result
        }).catch(e => console.log({createGenre: e}))
    }
}
function updateBookMark(formData) {
    const url = `/book/update-book?id=${formData.bookId}`;
    $patch(url, {bookmark: formData.bookmark}).then(result => {
        return result
    }).catch(e => console.log({loadCategories: e}))
}
function updateBook(bookData) {
    const url = bookData.id ? `/book/update?id=${bookData.id}` : `/book/create`
    if (bookData.id) {
        return $patch(url, bookData)
    } else {
        return $post(url, bookData)
    }
}

async function uploadFiles(files, bookId) {
    const token = sessionStorage.getItem('lib-token')
    const url = `${process.env.VUE_APP_API_URL}/media-storage/upload?book_id=${bookId}`;
    const resultPromise = await Promise.allSettled(
        files.map(async file => {
            let formData = new FormData();
            formData.append('file', file);
            const result = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return result.json()
        })
    )
    console.log({resultPromise: resultPromise})
    return resultPromise
}
async function deleteFile(fileId) {
    $delete(`/media-storage/delete?id=${fileId}`).then(result => {
        return result
    }).catch(e => console.log({deleteFile: e}));
}
async function deleteFiles(bookId) {
    $delete(`/book/delete-all-media?id=${bookId}`).then(result => {
        return result
    }).catch(e => console.log({deleteFiles: e}));
}



export {sendGenre, updateBook, updateBookMark, uploadFiles, deleteFile, deleteFiles};