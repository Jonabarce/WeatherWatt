<template>
  <div class="index-wrapper">
    <div class="list-wrapper">
      <div class="power-list-wrapper">
        <div class="title-power-list"></div>
        <powerlist />
      </div>
      <div class="weather-list-wrapper">
        <div class="title-weather-list"></div>
        <weatherlist />
      </div>
    </div>
  </div>
</template>

<script setup>
import weatherlist from '../components/weathercomponents/weatherlist.vue'
import powerlist from '../components/power-components/powerlist.vue'
</script>

<style scoped>
.title-power-list,
.title-weather-list {
  display: flex;
  align-items: center;
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 0.5em;
}

.index-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  width: 100%;
  background-color: #f9f9f9;
}

.list-wrapper {
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.power-list-wrapper,
.weather-list-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

@media screen and (max-width: 768px) {
  .list-wrapper {
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
  }

  .power-list-wrapper,
  .weather-list-wrapper {
    width: 100%;
  }
}
</style>
