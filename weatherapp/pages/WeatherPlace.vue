<template>
  <div class="the-weatherPlace-wrapper">
    <weatherPlace />
  </div>
</template>

<script setup>
import weatherPlace from '@/components/weathercomponents/weather-place.vue'
</script>

<style scoped>
.the-weatherPlace-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  place-items: center;
  background-color: #f9f9f9;
}
</style>
