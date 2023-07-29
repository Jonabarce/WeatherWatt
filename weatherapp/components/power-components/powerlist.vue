<template>
  <div class="the-powerlist-wrapper">
    <h1>Strømpriser</h1>
    <div class="powerlist-wrapper">
      <div class="test" v-for="area in areas" :key="area.value">
        <div class="power-wrapper">
          <p>Gjennomsnittlig pris: {{ area.averagePrice.toFixed(2) }} NOK</p>
          <h3>({{ area.name }})</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const areas = ref([])

const fetchData = async () => {
  const regions = [
    { value: 'NO1', name: 'Oslo / Øst-Norge' },
    { value: 'NO2', name: 'Kristiansand / Sør-Norge' },
    { value: 'NO3', name: 'Trondheim / Midt-Norge' },
    { value: 'NO4', name: 'Tromsø / Nord-Norge' },
    { value: 'NO5', name: 'Bergen / Vest-Norge' }
  ]

  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  for (const region of regions) {
    const response = await axios.get(
      `https://www.hvakosterstrommen.no/api/v1/prices/${year}/${month}-${day}_${region.value}.json`
    )
    const averagePrice =
      response.data.reduce((acc, cur) => acc + cur.NOK_per_kWh, 0) /
      response.data.length
    areas.value.push({ ...region, averagePrice })
  }
}

onMounted(fetchData)
</script>

<style scoped>
.the-powerlist-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  place-items: center;
}
.test {
  width: 95%;
}

.powerlist-wrapper {
  background-color: #ffffff;
  border-radius: 1.7rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
  gap: 1rem;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 85%;
}

.power-wrapper {
  display: flex;
  background-color: #f9f9f9;
  padding: 0.5rem;
  border-radius: 1.7rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 95%;
}

.power-wrapper:hover {
  cursor: pointer;
}

.power-wrapper svg {
  height: 3rem;
}

.power-wrapper h3 {
  margin-left: 10px;
}
</style>
