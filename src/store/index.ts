import { createStore } from 'vuex'

export default createStore({
  state: {
		data: null,
		rates: null,
  },
  getters: {
  },
  mutations: {
		setData(state, payload) {
			state.data = payload
		},
		setRates(state, payload) {
			state.rates = payload
		}
  },
  actions: {
		async getCurrencyData({commit}, [base, quote, time]) {
			let url = `https://rest.coinapi.io/v1/exchangerate/${base}/${quote}?time=${time}`
			
			await fetch(url, {
				"method": "GET",
				"headers": {'X-CoinAPI-Key': '3DB9D937-1B34-4979-9D45-566ADA46A55A'}
			}).then(res => res.json()).then(data => commit('setData', data))
		},
		async getAllCurrencyData({commit}, [base, quote]) {
			let url = `https://rest.coinapi.io/v1/exchangerate/${base}?invert=${quote}`
			
			await fetch(url, {
				"method": "GET",
				"headers": {'X-CoinAPI-Key': '3DB9D937-1B34-4979-9D45-566ADA46A55A'}
			}).then(res => res.json()).then(data => commit('setRates', data.rates))
		}
  },
})
