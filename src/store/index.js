import { createStore } from 'vuex'

export default createStore({
  state: {
    layout: 'LayoutDefault'
  },
  mutations: {
    setLayout(state, payload) {
      state.layout = payload
    }
  },
  actions: {
  },
  getters: {
    layout(state) {
      return state.layout
    }
  },
  modules: {
  }
})
