import {createStore} from 'vuex'
import main from './modules/main'
import genre from './modules/genre'
import book from './modules/book'
import user from './modules/user'

export default createStore({
  modules: {
    main,
    genre,
    book,
    user
  },
})
