import superFetch from "@/service/superFetch";
const state = () => ({
  data: {
    items: [],
    parents: [],
    itemsByType: []
  },
})

// getters
const getters = {
  items(state) {
    return state.data.items
  },
  parents(state) {
    return state.data.parents
  },
  byType(state) {
    return state.data.itemsByType
  },

}

// actions
const actions = {
  async loadGenres({commit}) {
    const result = await superFetch.$fetch('/genre/find')
    if (result) {
      commit('setGenre', result)
    }
  }
}

// mutations
const mutations = {
  setGenre(state, data) {
    state.data.items = data.genres
    state.data.itemsByType = data.genresByType
    state.data.parents = data.parents
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}