<template>
  <Header />
  <main class="main">
    <div class="main__wrapper">
      <h1 class="main__title">Choose currency bellow:</h1>
      <loader v-if="!data" />
      <div class="exchange" v-else>
        <div class="exchange__info">
          Last updated:
          <strong>{{ new Date(data.time).toLocaleString() }}</strong>
        </div>
        <exchangeField
          :currencyList="currencyList"
          v-model:currencyInput="originalCurrencyInput"
          v-model:currency="originalCurrency"
        />
        <div class="exchange__data">
          <button class="exchange__switch-btn" @click="switchCurrency()">
            Switch
          </button>
          <div class="exchange__rates">
            1 {{ data.asset_id_base }} = {{ currentRate }}
            {{ data.asset_id_quote }}
          </div>
        </div>
        <exchangeField
          :currencyList="currencyList"
          v-model:currencyInput="desiredCurrencyInput"
          v-model:currency="desiredCurrency"
          :disabledInput="true"
        />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./components/Header.vue";
import loader from "./components/loader.vue";
import exchangeField from "./components/exchangeField.vue";
import { mapActions, mapState } from "vuex";
export default defineComponent({
  name: "App",
  data() {
    return {
      // data: {
      //   time: "2023-02-23T11:49:53.5230000Z",
      //   asset_id_base: "USD",
      //   asset_id_quote: "BTC",
      //   rate: (0.00004213317298765248).toFixed(7),
      // },
      originalCurrencyInput: 1,
      desiredCurrencyInput: 0,
      originalCurrency: "USD",
      desiredCurrency: "BTC",
      currencyList: ["USD", "EUR", "UAH", "GBP", "BTC", "ETH", "BNB", "XRP"],
      currentRate: 0,
    };
  },
  methods: {
    ...mapActions(["getCurrencyData"]),
    switchCurrency() {
      let temporaryValue = this.originalCurrency;
      this.originalCurrency = this.desiredCurrency;
      this.desiredCurrency = temporaryValue;
      this.getDataOnChange();
    },
    async getDataOnChange() {
      let dateNow = new Date().toISOString();
      await this.getCurrencyData([
        this.originalCurrency,
        this.desiredCurrency,
        dateNow,
      ]);
      this.currentRate =
        this.data.rate.toString().length > 7
          ? this.data.rate.toFixed(7)
          : this.data.rate;

      this.desiredCurrencyInput = this.currentRate * this.originalCurrencyInput;
    },
  },
  watch: {
    originalCurrency() {
      this.getDataOnChange();
    },
    desiredCurrency() {
      this.getDataOnChange();
    },
    originalCurrencyInput(newState) {
      if (newState < 0 || newState == "") {
        this.originalCurrencyInput = 1;
      }
      this.desiredCurrencyInput = newState * this.currentRate;
    },
  },
  async mounted() {
    await this.getDataOnChange();
  },
  computed: {
    ...mapState(["data"]),
  },
  components: {
    Header,
    exchangeField,
    loader,
  },
});
</script>

<style lang="scss" scoped>
@import url(./assets/scss/main.scss);
.main {
  padding: 50px 0;
  &__wrapper {
    max-width: 1000px;
    padding: 0 15px;
    margin: 0 auto;
  }
  &__title {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    margin: 0 0 10px;
  }
}
.exchange {
  margin: 0 auto 60px;
  max-width: 320px;
  &__info {
    text-align: center;
    font-size: 14px;
    margin-bottom: 30px;
  }
  &__data {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 30px 0;
  }
  &__rates {
    font-weight: bold;
    font-size: 16px;
  }
  &__switch-btn {
    border: 0;
    width: 80px;
    height: 50px;
    border-radius: 5px;
    background: #555;
    color: #fff;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.3s ease all;
    position: relative;
    &:after,
    &:before {
      content: "";
      position: absolute;
      left: 50%;
      top: -25px;
      width: 30px;
      height: 20px;
      margin-left: -15px;
      background: url(@/assets/up-arrow.svg) 50% / contain no-repeat;
    }
    &:before {
      top: auto;
      bottom: -25px;
      transform: rotate(-180deg);
    }
    &:hover {
      background: #222;
    }
  }
}
</style>
