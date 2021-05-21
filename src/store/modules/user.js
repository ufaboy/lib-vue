const state = () => ({
	name: '',
	token: ''
})

// getters
const getters = {
	name(state) {
		return state.name
	},
	token(state) {
		return state.token
	},
}

// actions
const actions = {}

// mutations
const mutations = {
	setUser(state, payload) {
		state.name = payload.name
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