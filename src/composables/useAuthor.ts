import {inject, ref} from "vue";
import {sendAuthor} from "../utils/uploadData";
// @ts-expect-error
export default function useAuthor(props, emit) {
    const editableAuthor = ref({
        id: 0,
        name: '',
        url: '',
        ad: true,
    })
    if (props.author) {
        editableAuthor.value = props.author
    }
    const updateAuthor = async () => {
        try {
            await sendAuthor(editableAuthor.value)
            emit('update-authors')
            closeModal()
        } catch (e) {
            console.log('updateAuthor error', e)
        }
    }
    const deleteAuthor = () => {}
    const closeModal = () => {
        emit('hide-modal')
    }
    return {editableAuthor, closeModal, updateAuthor, deleteAuthor}
}