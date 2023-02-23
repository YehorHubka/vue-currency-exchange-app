<template>
  <div class="rate-card">
    <div class="rate-card__name">{{ name }}</div>
    <div class="rate-card__info">{{ rate?.toFixed(7) }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "rate-card",
  props: {
    name: String,
    rate: Number,
  },
});
</script>

<style lang="scss" scoped>
.rate-card {
  width: 150px;
  text-align: center;
  padding: 30px 10px;
  background: #fff;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  &__name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  &__info {
    font-weight: bold;
    font-size: 16px;
    color: #48b352;
  }
}
</style>