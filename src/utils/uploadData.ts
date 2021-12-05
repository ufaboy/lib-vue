import {Book, BookFile, BookScrolling, FileRaw} from "../interfaces/book";
import {GenreForm} from "../interfaces/genre";
import {$post, $patch, $delete} from "./superFetch";
import  {API_URL} from "../../runtimeEnv";



async function sendGenre(genreForm: GenreForm) {
    if (genreForm.id) {
        return await $patch(`/genre/update?id=${genreForm.id}`, genreForm);
    } else {
        return await $post(`/genre/create`, genreForm);
    }
}
async function updateBookMark(formData: BookScrolling) {
    const url = `/book/update-book?id=${formData.bookId}`;
    return await $patch(url, {bookmark: formData.bookmark});
}
async function updateBook(bookData: Book): Promise<Book> {
    const url = bookData.id ? `/book/update?id=${bookData.id}` : `/book/create`
    if (bookData.id) {
        let genresIdArray = bookData.genres.map(genre => genre.id)
        return await $patch(url, {...bookData, genres: genresIdArray})
    } else {
        return await $post(url, bookData)
    }
}

async function uploadFiles(files:FileRaw[], bookId:number) {
    const token = sessionStorage.getItem('lib-token')
    const url = `${API_URL}/media-storage/upload?book_id=${bookId}`;
    const resultPromise = await Promise.allSettled(
        files.map(async (fileRaw):Promise<BookFile> => {
            let formData = new FormData();
            formData.append('file', fileRaw.file);
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
    console.log({resultPromise: resultPromise});
    
    return resultPromise
}
function deleteFile(fileId:number) {
    return $delete(`/media-storage/delete?id=${fileId}`);
}
function deleteFiles(bookId:number) {
    return $delete(`/book/delete-all-media?id=${bookId}`);
}
function deleteFileByName(directory:string, name:string) {
    return $delete(`/media-storage/delete-file-by-name`, {name: name, directory: directory})
}
function attachFileToBook(bookId:number, name:string) {
    return $post(`/media-storage/attach-file?id=${bookId}`, {name: name})
}

export {sendGenre, updateBook, updateBookMark, uploadFiles, deleteFile, deleteFiles, deleteFileByName, attachFileToBook};