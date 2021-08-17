import {loadCategories} from "@/utils/loadData";

const state = () => ({
  categories: [],
  items: []
})

// getters
const getters = {
}

// actions
const actions = {
  async loadCategories({commit}, payload) {
    try {
      const result = await loadCategories(payload)
      commit('setCategories', result)
    } catch (e) {
      console.log({'actions loadCategories': e})
    }
  }
}

// mutations
const mutations = {
  setCategories(state, data) {
    state.categories = [...data]
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}