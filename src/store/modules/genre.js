const state = () => ({
  data: {
    items: [],
    parents: {},
    itemsByType: {}
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
    console.log({'this': this, '$fetch': this.$fetch})
    const result = await fetch('/genre/find')
    if (result) {
      commit('setGenre', result)
    }
  }
}

// mutations
const mutations = {
  setGenre(state, data) {
    state.data = data
    console.log({'state': state.data})
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}