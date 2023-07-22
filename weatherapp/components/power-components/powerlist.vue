<template>
  <div>
    <h1>Strømpriser</h1>
    <div v-for="area in areas" :key="area.value">
      <div class="power-wrapper">
        <svg fill="green" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m286-79 171-307-337-40 495-455h59L503-574l337 40L345-79h-59Zm167-187 252-223-297-36 99-169-253 224 297 35-98 169Zm27-214Z"/></svg>
        <p>Gjennomsnittlig pris: {{ area.averagePrice }} NOK</p>
        <h3>({{ area.name }})</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const areas = ref([]);

const fetchData = async () => {
  const regions = [
    { value: 'NO1', name: 'Oslo / Øst-Norge' },
    { value: 'NO2', name: 'Kristiansand / Sør-Norge' },
    { value: 'NO3', name: 'Trondheim / Midt-Norge' },
    { value: 'NO4', name: 'Tromsø / Nord-Norge' },
    { value: 'NO5', name: 'Bergen / Vest-Norge' },
  ];

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  for (const region of regions) {
    const response = await axios.get(`https://www.hvakosterstrommen.no/api/v1/prices/${year}/${month}-${day}_${region.value}.json`);
    const averagePrice = response.data.reduce((acc, cur) => acc + cur.NOK_per_kWh, 0) / response.data.length;
    areas.value.push({ ...region, averagePrice });
  }
};

onMounted(fetchData);
</script>


<style scoped>


.power-wrapper{
  display: flex;
}

.power-wrapper svg {
  height: 3rem;
}

.power-wrapper h3 {
  margin-left: 10px;
}


</style>