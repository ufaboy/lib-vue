import {$get} from "@/service/superFetch";
const state = () => ({
  items: []
})

// getters
const getters = {
  items(state) {
    return state.items
  },
}

// actions
const actions = {
  async loadGenres({commit}) {
    const result = await $get('/genre?type=parent')
    if (result) {
      commit('setGenre', result)
    }
  }
}

// mutations
const mutations = {
  setGenre(state, data) {
    state.items = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}