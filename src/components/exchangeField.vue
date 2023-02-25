<template>
  <div class="exchange__fields">
    <select
      class="exchange__select"
      :value="currency"
      @change="$emit('update:currency', ($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="(currency, idx) in currencyList"
        :key="idx"
        :value="currency"
      >
        {{ currency }}
      </option>
    </select>
    <input
      class="exchange__input"
      type="number"
      :value="currencyInput"
      :disabled="disabledInput"
      @input="$emit('update:currencyInput', parseInt(($event.target as HTMLInputElement).value))"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "exchange-fields",
  props: {
    currencyList: Array,
    currencyInput: Number,
    currency: String,
    disabledInput: Boolean,
  },
  emits: ["update:currencyInput", "update:currency"],
});
</script>

<style lang="scss" scoped>
.exchange {
  &__fields {
    display: flex;
  }
  &__select {
    min-width: 80px;
    height: 50px;
    padding: 0;
    text-align: center;
    background: #fff;
    border: 2px solid #555;
    border-radius: 5px 0 0 5px;
    font-size: 16px;
    outline: 0;
    color: #000;
  }
  &__input {
    outline: 0;
    height: 50px;
    padding: 0 15px;
    width: 100%;
    background: #fff;
    border: 2px solid #555;
    border-left: 0;
    border-radius: 0 5px 5px 0;
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }
}
</style>