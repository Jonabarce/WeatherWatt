<template>
  <h1>Bynavn</h1>
  <div class="the-weatherplace-wrapper">
    <div class="weatherplace-card-wrapper">
      <div class="display">
        <Icon class="umbrella-icon" name="fluent-emoji:thermometer" />23
      </div>
      <div class="display">
        <Icon class="umbrella-icon" color="#ff9d00" name="ph:wind-duotone" />5
        m/s
      </div>
      <div class="display">
        <Icon
          class="umbrella-icon"
          name="fluent-emoji:umbrella-with-rain-drops"
        />
        <p>0mm</p>
      </div>
    </div>
    <div class="list-of-days">
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { watch, reactive } from 'vue'
import axios from 'axios'
import useCookieStore from '/stores/cityStore'
import { debounce } from 'lodash'

async function fetchWeather() {}
</script>

<style scoped>
.the-weatherplace-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  place-items: center;
  background-color: #f9f9f9;
}

.weatherplace-card-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: #ffffff;
  border-radius: 1.7rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 55%;
  height: 35%;
}

.list-of-days {
  width: 95%;
  height: 100%;
  background-color: #ffffff;
  margin-top: 3rem;
  margin-bottom: 3rem;
  border-radius: 1.7rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.a-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10rem;
  background-color: #ffffff;
  border-radius: 1.7rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 55%;
  height: 35%;
}

.umbrella-icon {
  height: 2rem;
  width: 2rem;
}

.display {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
