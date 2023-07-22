<template>
  <div class="index-wrapper">
    <div class="list-wrapper">
      <div class="power-list-wrapper">
        <div class="title-power-list">
          <p>Strøm</p>
        </div>
        <powerlist />
      </div>
      <div class="weather-list-wrapper">
        <div class="title-weather-list">
          <p>Været</p>
        </div>
        <div class="searchbar-wrapper">
          <searchbar />
        </div>
        <weatherlist />
      </div>
    </div>
  </div>
</template>

<script setup>
import searchbar from '../components/defaults/searchbar.vue'
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
}

.list-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.power-list-wrapper,
.weather-list-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
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