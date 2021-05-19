const state = () => ({
	layout: 'LayoutDefault',
	isMobile: false
})

// getters
const getters = {
	layout(state) {
		return state.layout
	}
}

// actions
const actions = {}

// mutations
const mutations = {
	setLayout(state, payload) {
		state.layout = payload
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}