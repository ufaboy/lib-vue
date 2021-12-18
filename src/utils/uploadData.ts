import {Book, BookFile, BookScrolling, FileRaw} from "../interfaces/book";
import {GenreForm} from "../interfaces/genre";
import {$post, $patch, $delete} from "./superFetch";
import  {API_URL} from "../../runtimeEnv";



async function sendGenre(genreForm: GenreForm) {
    if (genreForm.id) {
        return await $patch(new URL(`${API_URL}/genre/update?id=${genreForm.id}`), genreForm);
    } else {
        return await $post(new URL(`${API_URL}/genre/create`), genreForm);
    }
}
async function updateBookMark(formData: BookScrolling) {
    const url = new URL(`${API_URL}/book/update-book?id=${formData.bookId}`);
    return await $patch(url, {bookmark: formData.bookmark});
}
async function updateBook(bookData: Book): Promise<Book> {
    if (bookData.id) {
        const url = new URL(`${API_URL}/book/update?id=${bookData.id}`);
        const genresIdArray = bookData.genres.map(genre => genre.id)
        return await $patch(url, {...bookData, genres: genresIdArray})
    } else {
        const url = new URL(`${API_URL}/book/create`)
        return await $post(url, bookData)
    }
}

async function uploadFiles(files:FileRaw[], bookId:number) {
    const token = sessionStorage.getItem('lib-token')
    const url = new URL(`${API_URL}/media-storage/upload?book_id=${bookId}`)
    const resultPromise = await Promise.allSettled(
        files.map(async (fileRaw):Promise<BookFile> => {
            let formData = new FormData();
            const file = fileRaw as unknown as Blob
            formData.append('file', file);
            const result = await fetch(url.toString(), {
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
    return $delete(new URL(`${API_URL}/media-storage/delete?id=${fileId}`));
}
function deleteFiles(bookId:number) {
    return $delete(new URL(`${API_URL}/book/delete-all-media?id=${bookId}`));
}
function deleteFileByName(directory:string, name:string) {
    return $delete(new URL(`${API_URL}/media-storage/delete-file-by-name`), {name: name, directory: directory})
}
function attachFileToBook(bookId:number, name:string) {
    return $post(new URL(`${API_URL}/media-storage/attach-file?id=${bookId}`), {name: name})
}

export {sendGenre, updateBook, updateBookMark, uploadFiles, deleteFile, deleteFiles, deleteFileByName, attachFileToBook};