import { createStore } from 'vuex'

export default createStore({
  state: {
		data: null,
		rates: null,
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

			// free key from API (100 gets per day from REST)
			// google 9BB1685B-3563-436C-AA37-CAC8FFDCF6F6
			// rabler 22BE6FFA-21EF-4612-8E47-CE0505683190
			// mail.ru 3DB9D937-1B34-4979-9D45-566ADA46A55A
			
			await fetch(url, {
				"method": "GET",
				"headers": {'X-CoinAPI-Key': '9BB1685B-3563-436C-AA37-CAC8FFDCF6F6'}
			}).then(res => res.json()).then(data => commit('setData', data))
		},
		async getAllRates({commit}, [base, quote]) {
			let url = `https://rest.coinapi.io/v1/exchangerate/${base}?invert=${quote}`
			
			await fetch(url, {
				"method": "GET",
				"headers": {'X-CoinAPI-Key': '9BB1685B-3563-436C-AA37-CAC8FFDCF6F6'}
			}).then(res => res.json()).then(data => commit('setRates', data.rates))
		}
  },
})
