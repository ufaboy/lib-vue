import {$post, $patch, $delete} from "@/utils/superFetch";

function sendGenre(genreForm) {
    let result;
    if (genreForm.id) {
        result = $patch(`/genre/update?id=${genreForm.id}`, genreForm)
    } else {
        result = $post(`/genre/create`, genreForm)
    }
    return result
}
function updateBookMark(formData) {
    const url = `/book/update-book?id=${formData.bookId}`;
    return $patch(url, {bookmark: formData.bookmark})
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
            return await result.json()
        })
    )
    console.log({resultPromise: resultPromise})
    return resultPromise
}
function deleteFile(fileId) {
    return $delete(`/media-storage/delete?id=${fileId}`);
}
function deleteFiles(bookId) {
    return $delete(`/book/delete-all-media?id=${bookId}`);
}



export {sendGenre, updateBook, updateBookMark, uploadFiles, deleteFile, deleteFiles};