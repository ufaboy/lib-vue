import {$post, $patch, $delete} from "@/service/superFetch";

async function sendGenre(genreForm) {
    let result;
    if (genreForm.id) {
        result = await $patch(`/genre/update?id=${genreForm.id}`, genreForm)
    } else {
        result = await $post(`/genre/create`, genreForm)
    }
    return result
}
async function updateBookMark(formData) {
    const url = `/book/update-book?id=${formData.bookId}`;
    return  await $patch(url, {bookmark: formData.bookmark})
}

async function uploadFiles(files, bookId) {
    const token = sessionStorage.getItem('lib-token')
    const url = `${process.env.VUE_APP_API_URL}/media-storage/upload?book_id=${bookId}`;
    return Promise.allSettled(
        files.map(async file => {
            let formData = new FormData();
            formData.append('file', file);
            console.log({formData: formData})
            return await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        })
    );

    // if (response) {
    //   const elem = await response.json();
    //   console.log(elem)
    //   this.book.files.push(elem)
    //   this.files.splice(index, 1)
    // }
    // async sendFile(file, index) {
        // return new Promise(function (resolve, reject) {
        //     let formData = new FormData();
        //     formData.append('file', file);
        //     let xhr = new XMLHttpRequest();
        //     const token = sessionStorage.getItem('lib-token')
        //     xhr.open("POST", `${process.env.VUE_APP_API_URL}/media-storage/upload?book_id=${this.book.id}`);
        //     xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        //     xhr.responseType = 'json';
        //
        //     xhr.upload.onprogress = async (event) => {
        //         this.uploadingProgress[index] = Math.round(event.loaded * 100 / event.total)
        //         this.$forceUpdate()
        //     };
        //     xhr.onloadend = () => {
        //         if (xhr.status === 200) {
        //             this.files[index] = xhr.response
        //             this.$forceUpdate()
        //             resolve(xhr.response);
        //         } else {
        //             console.log("Ошибка " + this.status);
        //             reject(xhr.status);
        //         }
        //     };
        //     xhr.send(formData);
        //
        // }.bind(this))
}

async function deleteFiles(bookId) {
    return  await $delete(`/book/delete-all-media?id=${bookId}`);
}



export {sendGenre, updateBookMark, uploadFiles, deleteFiles};