import App from "@/App";
const state = () => ({
	data: {
		items: [],
		parents: {},
		itemsByType: {}
	},
})

// getters
const getters = {
	items (state) {
		return state.data.items
	},
	parents (state) {
		return state.data.parents
	},
	byType (state) {
		return state.data.itemsByType
	},

}

// actions
const actions = {
	async loadGenres({ commit}) {
		console.log({'$fetch': App})
		const result = await App.$fetch('/genre/find')
		if (result) {
			commit('setGenre', result)
		} else console.log({'loadGenres': result})
	}
}

// mutations
const mutations = {
	setGenre (state, data) {
		state.data = data
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}