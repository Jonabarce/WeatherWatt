<template>
  <div class="the-wrapper-div-weather-list">
    <h1>Været</h1>
    <div class="searchbar-wrapper">
      <searchbar />
    </div>
    <br />
    <div class="the-weather-list-wrapper">
      <div class="cities">
        <div v-for="city in allCitiesOrdered" :key="city" class="city">
          <button
            @click="
              isFavorited(city) ? removeFavorite(city) : addFavorite(city)
            "
            class="btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path
                :class="{
                  'icon-yellow': isFavorited(city),
                  'icon-gray': !isFavorited(city)
                }"
                d="m323-205 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-355Z"
              />
            </svg>
          </button>
          <span class="city-name">{{ city }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import useCookieStore from '/stores/cityStore'
import searchbar from '@/components/defaults/searchbar.vue'

onMounted(async () => {
  for (const city of allCities) {
    await getWeather(city)
  }
})

const allCities = ['Oslo', 'Bergen', 'Stavanger', 'Trondheim', 'Tromsø', 'Bodø']
const { favorites, addFavorite, removeFavorite, isFavorited } = useCookieStore()

const nonFavoritedCities = computed(() => {
  return allCities.filter((city) => !favorites.value.includes(city))
})

const allCitiesOrdered = computed(() => {
  return [...favorites.value, ...nonFavoritedCities.value]
})

const weatherCache = ref({})

onMounted(async () => {
  for (const city of allCities) {
    await geocode(city)
  }
})

async function geocode(city) {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent('oslo')}&limit=1`
    )

    if (!response.data || response.data.length === 0) {
      console.error(`Kunne ikke hente geokoding for byen: ${city}`)
      return
    }

    const { lat, lon } = response.data[0]
    console.log(`Koordinater for ${city}: lat = ${parseFloat(lat)}, lon = ${parseFloat(lon)}`)
  } catch (error) {
    console.error(`Noe gikk galt ved henting av koordinater for byen ${city}:`, error)
  }
}

</script>

<style scoped>
.the-wrapper-div-weather-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.the-weather-list-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 1.7rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 85%;
}

.cities {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.city {
  display: flex;
  background-color: #f9f9f9;
  padding: 0.5rem;
  gap: 1rem;
  margin-top: 1rem;
  border-radius: 1.7rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 95%;
}

.city img {
  height: 3rem;
}

.city span {
  margin-left: 10px;
}

.city-name {
  margin-right: 0.5em;
}

.btn {
  background-color: transparent;
  border: none;
  padding: 0.5em;
  margin-right: 0.5em;
  cursor: pointer;
}

.icon-yellow {
  fill: #ffcd69;
}

.icon-gray {
  fill: gray;
}
</style>
