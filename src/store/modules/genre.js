import {loadDivisions} from "@/service/loadData";

const state = () => ({
  divisions: [],
  items: []
})

// getters
const getters = {
}

// actions
const actions = {
  async loadDivisions({commit}, payload) {
    try {
      const result = await loadDivisions(payload)
      commit('setDivisions', result)
    } catch (e) {
      console.log({'loadDivisions': e})
    }
  }
}

// mutations
const mutations = {
  setDivisions(state, data) {
    state.divisions = [...data]
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}