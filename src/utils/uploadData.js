import {$post, $patch, $delete} from "@/utils/superFetch";

async function sendGenre(genreForm) {
    console.log({sendGenre: genreForm})
    if (genreForm.id) {
        return await $patch(`/genre/update?id=${genreForm.id}`, genreForm);
    } else {
        return await $post(`/genre/create`, genreForm);
    }
}
async function updateBookMark(formData) {
    const url = `/book/update-book?id=${formData.bookId}`;
    return await $patch(url, {bookmark: formData.bookmark});
}
async function updateBook(bookData) {
    const url = bookData.id ? `/book/update?id=${bookData.id}` : `/book/create`
    if (bookData.id) {
        return await $patch(url, bookData)
    } else {
        return await $post(url, bookData)
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
function deleteFile(fileId) {
    return $delete(`/media-storage/delete?id=${fileId}`);
}
function deleteFiles(bookId) {
    return $delete(`/book/delete-all-media?id=${bookId}`);
}
function deleteFileByName(directory, name) {
    return $delete(`/media-storage/delete-file-by-name`, {name: name, directory: directory})
}
function attachFileToBook(bookId, name) {
    return $post(`/media-storage/attach-file?id=${bookId}`, {name: name})
}

export {sendGenre, updateBook, updateBookMark, uploadFiles, deleteFile, deleteFiles, deleteFileByName, attachFileToBook};