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
    try {
      const result = await $get('/genre?type=parent')
      commit('setGenre', result)
    } catch (e) {
      console.log({'result': e})
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