import { createStore } from 'vuex'

export default createStore({
  state: {
		data: null,
  },
  getters: {
  },
  mutations: {
		setData(state, payload) {
			state.data = payload
		}
  },
  actions: {
		async getCurrencyData({commit}, [base, quote, time]) {
			let url = `https://rest.coinapi.io/v1/exchangerate/${base}/${quote}?time=${time}`
			
			await fetch(url, {
				"method": "GET",
				"headers": {'X-CoinAPI-Key': '22BE6FFA-21EF-4612-8E47-CE0505683190'}
			}).then(res => res.json()).then(data => commit('setData', data))
		}
  },
})
