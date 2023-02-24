<template>
  <header class="header">
    <div class="header__logo">
      <img width="40" alt="Vue logo" src="@/assets/logo.png" />
    </div>
    <div class="header__title">Currency Exchange App</div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Header",
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
  gap: 15px;
  background: #fff;
  &__title {
    font-size: 20px;
    font-weight: 900;
    color: #000;
  }
  &__logo {
    img {
      display: block;
    }
  }
}
</style>