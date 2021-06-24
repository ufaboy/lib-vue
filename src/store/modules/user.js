const state = () => ({
	username: '',
	token: ''
})

// getters
const getters = {
	username(state) {
		return state.username
	},
	token(state) {
		return state.token
	},
}

// actions
const actions = {
	async setUser({commit}, data) {
		commit('setUser', data)
	}
}

// mutations
const mutations = {
	setUser(state, payload) {
		state.username = payload.username
		state.token = payload.token
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}