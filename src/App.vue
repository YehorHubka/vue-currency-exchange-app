<template>
  <Header />
  <main class="main">
    <div class="main__wrapper" v-if="rates">
      <h1 class="main__title">Choose currency bellow:</h1>
      <div class="exchange">
        <div class="exchange__alert" v-if="isBigValue">
          You can exchange maximum {{ maxValue }} {{ originalCurrency }}
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

      <h2 class="main__title">Currency rates</h2>
      <div class="rates">
        <div class="rates__info">
          <div class="rates__info-title">
            Choose interested currency to have an rates information:
          </div>
          <select class="rates__info-select" v-model="interestedCurrency">
            <option
              v-for="(currency, idx) in interestedCurrencyList"
              :key="idx"
              :value="currency"
            >
              {{ currency }}
            </option>
          </select>
        </div>
        <div class="rates__cards">
          <rateCard
            v-for="(rate, i) in choosenRatesData"
            :key="i"
            :name="rate.asset_id_quote"
            :rate="rate.rate"
          />
        </div>
        <div class="rates__controls">
          <button class="btn" @click="openModal = true">
            + Add more cards
          </button>
          <button class="btn" @click="refreshData" :disabled="refreshDisabled">
            Refresh data
            <span v-if="refreshDisabled">({{ disabledDuration }})</span>
          </button>
        </div>
      </div>
      <Teleport to="body">
        <cardModal
          :openModal="openModal"
          title="Add new card"
          @close="(val) => (openModal = val)"
        >
          <form action="#" @submit.prevent="cardFormHandler">
            <input list="rates" v-model="addCardName" class="search-input" />
            <datalist id="rates">
              <option
                v-for="(rate, i) in rates"
                :key="i"
                :value="rate.asset_id_quote"
              ></option>
            </datalist>
            <button class="btn btn-search" type="submit">
              + Add rate card
            </button>
          </form>
        </cardModal>
      </Teleport>
    </div>
    <div class="server_info" v-else>
      <loader />
      <p>
        If you see loader to long - <br />
        coinapi.io REST API dont give an answer <br />
        with needed data for App working
      </p>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./components/Header.vue";
import loader from "./components/loader.vue";
import rateCard from "./components/rateCard.vue";
import exchangeField from "./components/exchangeField.vue";
import cardModal from "./components/cardModal.vue";
import { mapActions, mapState } from "vuex";

export default defineComponent({
  name: "App",
  data() {
    return {
      refreshDisabled: false,
      disabledDuration: 5,
      addCardName: "",
      openModal: false,
      choosenRatesData: [] as Array<any>,
      choosenRatesFromStorage: [] as Array<any>,
      choosenRates: ["USD", "EUR", "UAH", "BTC", "ETH"],
      interestedCurrencyList: ["USD", "EUR", "UAH"],
      interestedCurrency: "USD",
      originalCurrencyInput: 1,
      desiredCurrencyInput: 0,
      originalCurrency: "USD",
      desiredCurrency: "BTC",
      currencyList: ["USD", "EUR", "UAH", "GBP", "BTC", "ETH", "BNB", "XRP"],
      currentRate: 0,
      isBigValue: false,
      maximumValue: 10000,
      ratesForUSD: [] as Array<any>,
    };
  },
  methods: {
    ...mapActions(["getCurrencyData", "getAllRates"]),
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
    async getAllDataToShow() {
      await this.getAllRates([this.interestedCurrency, false]);

      if (!JSON.parse(localStorage.getItem("choosenRates") || "[]")) {
        localStorage.setItem("choosenRates", JSON.stringify(this.choosenRates));
        localStorage.setItem("ratesForUSD", JSON.stringify(this.rates));
      } else {
        this.choosenRatesFromStorage = JSON.parse(
          localStorage.getItem("choosenRates") || "[]"
        );

        this.choosenRatesData = this.choosenRatesFromStorage
          .map((i) => {
            return this.rates.find((item: any) => {
              return item.asset_id_quote == i;
            });
          })
          .filter((i) => i !== undefined);
      }
    },
    cardFormHandler() {
      if (this.addCardName) {
        this.choosenRatesFromStorage.push(this.addCardName);
        localStorage.setItem(
          "choosenRates",
          JSON.stringify(this.choosenRatesFromStorage)
        );
      }
      this.choosenRatesFromStorage = JSON.parse(
        localStorage.getItem("choosenRates") || "[]"
      );
      this.getAllDataToShow();

      this.addCardName = "";
      this.openModal = false;
    },
    countDownTimer() {
      if (this.disabledDuration > 0) {
        setTimeout(() => {
          this.disabledDuration -= 1;
          this.countDownTimer();
        }, 1000);
      }
    },
    refreshData() {
      this.getAllDataToShow();
      this.refreshDisabled = true;
      this.disabledDuration = 5;
      this.countDownTimer();
      setTimeout(() => {
        this.refreshDisabled = false;
      }, this.disabledDuration * 1000);
    },
  },
  watch: {
    originalCurrency() {
      this.getDataOnChange();
    },
    desiredCurrency() {
      this.getDataOnChange();
    },
    interestedCurrency() {
      this.getAllDataToShow();
    },
    originalCurrencyInput(newState) {
      if (newState < 0 || newState == "") {
        this.originalCurrencyInput = 1;
      }

      newState > this.maxValue
        ? (this.isBigValue = true)
        : (this.isBigValue = false);
      this.desiredCurrencyInput = newState * this.currentRate;
    },
  },
  async mounted() {
    await this.getDataOnChange();
    await this.getAllDataToShow();
  },
  computed: {
    ...mapState(["data", "rates"]),
    maxValue(): number {
      let val = 0;
      if (this.originalCurrency !== "USD") {
        const ratesData = JSON.parse(
          localStorage.getItem("ratesForUSD") || "[]"
        );
        val = ratesData.filter(
          (i: any) => i.asset_id_quote == this.originalCurrency
        )[0].rate;
      } else {
        val = 1;
      }
      return val * this.maximumValue;
    },
  },
  components: {
    Header,
    exchangeField,
    loader,
    rateCard,
    cardModal,
  },
});
</script>

<style lang="scss" scoped>
@import url(./assets/scss/main.scss);
.main {
  padding: 40px 0;
  &__wrapper {
    max-width: 1000px;
    padding: 0 15px;
    margin: 0 auto;
  }
  &__title {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    margin: 0 0 30px;
  }
}
.exchange {
  margin: 0 auto 60px;
  max-width: 350px;
  position: relative;
  &__alert {
    position: absolute;
    width: 100%;
    top: -15px;
    left: 0;
    text-align: center;
    color: #f00;
    font-size: 12px;
  }
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
.rates {
  &__info {
    max-width: 250px;
    margin: 30px auto;
    text-align: center;
    &-title {
      margin-bottom: 10px;
      font-size: 16px;
      line-height: 1.5;
    }
    &-select {
      width: 80px;
      height: 40px;
      padding: 0 0 0 5px;
      background: #fff;
      border: 2px solid #555;
      border-radius: 5px;
      font-size: 16px;
      outline: 0;
    }
  }
  &__cards {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
  }
  &__controls {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
  }
}
.btn {
  border: 0;
  width: 160px;
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
  &:hover {
    background: #222;
  }
  &:disabled {
    background: #ccc;
    cursor: inherit;
  }
}
.search-input {
  outline: 0;
  height: 50px;
  padding: 0 15px;
  width: 100%;
  background: #fff;
  border: 2px solid #555;
  border-radius: 5px;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 20px;
}
.btn-search {
  width: 100%;
}
.server_info {
  text-align: center;
  max-width: 600px;
  margin: 50px auto;
  p {
    color: #aaa;
  }
}
</style>
