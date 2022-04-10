import {ref} from "vue";
import {loadAuthors} from '../utils/loadData';
import {Author} from "../interfaces/author";

export default function useAuthors() {
    const modalAuthor = ref<InstanceType<typeof HTMLElement>>()
    const authors = ref<Author[]>([{id: 0,name: '', url: '', ad: true}])
    const activeAuthor = ref<Author>({id: 0, name:'', url:'', ad:true})
    const modalAuthorShow = ref(false);
    const ascending = ref(true);
    const orderBy = ref({name: 'name', asc: false});
    const getAuthors = async function() {
        try {
            authors.value = await loadAuthors()
        } catch (e) {
            console.log('loadAuthors error', e)
        }
    }
    const openRow = (row:Author) => {
        try {
            activeAuthor.value = row
            modalAuthorShow.value = true
            // @ts-expect-error
            modalAuthor.value?.showModal()
        } catch (e) {
            console.log('openRow error', e)
        }
    }
    const createAuthor = () => {
        activeAuthor.value = {
            id: 0,
            name: '',
            url: '',
            ad: true,
        };
        modalAuthorShow.value = true
        // @ts-expect-error
        modalAuthor.value?.showModal()
    }
    const saveOrderBy = function () {
        localStorage.setItem('orderby-authors', JSON.stringify(orderBy.value));
    }
    const loadOrderBy = function () {
        const data = localStorage.getItem('orderby-authors')
        if (data) {
            orderBy.value = JSON.parse(data)
        }
    }
    const sortBy = (column:string) => {
        orderBy.value.asc = !orderBy.value.asc
        orderBy.value.name = column
        saveOrderBy()
        getAuthors()
    }
    const closeDialog = () => {
        // @ts-expect-error
        modalAuthor.value?.close()
        modalAuthorShow.value = false
    }

    return {modalAuthor, modalAuthorShow, authors, ascending, orderBy, activeAuthor, sortBy, getAuthors, openRow, createAuthor, closeDialog}
}