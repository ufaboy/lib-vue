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
		commit('setUsername', data.username)
		commit('setToken', data.token)
	}
}

// mutations
const mutations = {
	setUsername(state, username) {
		state.username = username
	},
	setToken(state, token) {
		state.token = token
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}