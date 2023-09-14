<template>
  <div class="the-wrapper-div-weather-list">
    <h1>Været</h1>
    <div class="searchbar-wrapper">
      <input
        class="the-searchbar"
        placeholder="Søk her"
        type="text"
        name=""
        id=""
        v-model="searchText"
      />
    </div>
    <div v-for="result in searchResults" :key="result.place_id" class="city">
  <span>
    <button @click="toggleFavorite(result)" class="btn">
      <Icon
        class="star-icon"
        color="#ff9d00"
        :name="isFavorited(result.place_id) ? 'ph:star-fill' : 'ph:star-duotone'"
      />
    </button>
    {{ result.display_name }}
  </span>
</div>
    <br />
    <div class="the-weather-list-wrapper">
      <div class="cities">
        <div v-for="city in favorites" :key="city.place_id" class="city" @click="selectCityAndRoute(city)" >
          <button @click="toggleFavorite(city)" class="btn">
            <Icon
              class="star-icon"
              color="#ff9d00"
              :name="isFavorited(city.place_id) ? 'ph:star-fill' : 'ph:star-duotone'"
            />
            <img :src="getWeatherIcon(city)" alt="Weather Icon" />
          </button>
          <span class="city-name">{{ city.display_name }} {{ getTemperature(city) }}°C</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { watch, reactive } from 'vue'
import axios from 'axios'
import useCookieStore from '/stores/cityStore'
import useCurrentCityStore from '/stores/currentCity'
import { useRouter } from 'vue-router'

import { debounce } from 'lodash'

const searchText = ref('')
const searchResults = ref([])
const router = useRouter()


const { favorites, addFavorite, removeFavorite, isFavorited, clearFavorites } = useCookieStore()
const { setCurrent } = useCurrentCityStore()

const weatherCache = ref({})

onMounted(() => {
  console.log(favorites.value)
  favorites.value.forEach(city => {
    fetchWeather(city);
  });
});

onBeforeUnmount(() => {
  weatherCache.value = {};
});


const performSearch = debounce(async () => {
  if (!searchText.value) {
    searchResults.value = []
    return
  }

  const url = `https://nominatim.openstreetmap.org/search?city=${searchText.value}&format=json`
  try {
    const response = await axios.get(url)
    searchResults.value = response.data
    console.log(response.data)
  } catch (error) {
    console.error(`En feil oppstod under søket:`, error)
  }
}, 300)

watch(searchText, () => {
  performSearch()
})

function selectCityAndRoute(city) {
  setCurrent(city)
  router.push("/WeatherPlace")
}



function toggleFavorite(cityData) {
  if (isFavorited(cityData.place_id)) {
    console.log('removing favorite' + cityData.place_id)
    removeFavorite(cityData.place_id);
    if(weatherCache.value[cityData.place_id]) {
      delete weatherCache.value[cityData.place_id];
    }
  } else {
    addFavorite(cityData);
    fetchWeather(cityData);
  }
}



async function fetchWeather(city) {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${city.lat}&lon=${city.lon}`
  try {
    const response = await axios.get(url)
    const weather = response.data

    if (
      weather.properties.timeseries &&
      weather.properties.timeseries.length > 0
    ) {
      const currentTimeUTC = new Date().getTime()

      const sortedTimeseries = weather.properties.timeseries.sort((a, b) => {
        return (
          Math.abs(new Date(a.time).getTime() - currentTimeUTC) -
          Math.abs(new Date(b.time).getTime() - currentTimeUTC)
        )
      })

      const closestTimeseries = sortedTimeseries[0]

      const instantData = closestTimeseries.data.instant.details
      const next1HourData = closestTimeseries.data.next_1_hours

      weatherCache.value[city.place_id] = {
        air_temperature: instantData.air_temperature,
        symbol_code: next1HourData.summary.symbol_code
      }

      console.log(weatherCache.value)

    } else {
      console.error(`Ingen timeseries-data funnet for ${city}`)
    }
  } catch (error) {
    console.error(`En feil oppstod under værhenting for ${city}:`, error)
  }
}

function mapWeatherIcon(symbol_code) {
  const mapping = {
    clearsky_day: '01d',
    clearsky_night: '01n',
    clearsky_polartwilight: '01m',
    fair_day: '02d',
    fair_night: '02n',
    fair_polartwilight: '02m',
    partlycloudy_day: '03d',
    partlycloudy_night: '03n',
    partlycloudy_polartwilight: '03m',
    cloudy: '04',
    rainshowers_day: '05d',
    rainshowers_night: '05n',
    rainshowers_polartwilight: '05m',
    rainshowersandthunder_day: '06d',
    rainshowersandthunder_night: '06n',
    rainshowersandthunder_polartwilight: '06m',
    sleetshowers_day: '07d',
    sleetshowers_night: '07n',
    sleetshowers_polartwilight: '07m',
    snowshowers_day: '08d',
    snowshowers_night: '08n',
    snowshowers_polartwilight: '08m',
    rain: '09',
    heavyrain: '10',
    heavyrainandthunder: '11',
    sleet: '12',
    snow: '13',
    snowandthunder: '14',
    fog: '15',
    sleetshowersandthunder_day: '20d',
    sleetshowersandthunder_night: '20n',
    sleetshowersandthunder_polartwilight: '20m',
    snowshowersandthunder_day: '21d',
    snowshowersandthunder_night: '21n',
    snowshowersandthunder_polartwilight: '21m',
    rainandthunder: '22',
    sleetandthunder: '23',
    lightrainshowersandthunder_day: '24d',
    lightrainshowersandthunder_night: '24n',
    lightrainshowersandthunder_polartwilight: '24m',
    heavyrainshowersandthunder_day: '25d',
    heavyrainshowersandthunder_night: '25n',
    heavyrainshowersandthunder_polartwilight: '25m',
    lightssleetshowersandthunder_day: '26d',
    lightssleetshowersandthunder_night: '26n',
    lightssleetshowersandthunder_polartwilight: '26m',
    heavysleetshowersandthunder_day: '27d',
    heavysleetshowersandthunder_night: '27n',
    heavysleetshowersandthunder_polartwilight: '27m',
    lightssnowshowersandthunder_day: '28d',
    lightssnowshowersandthunder_night: '28n',
    lightssnowshowersandthunder_polartwilight: '28m',
    heavysnowshowersandthunder_day: '29d',
    heavysnowshowersandthunder_night: '29n',
    heavysnowshowersandthunder_polartwilight: '29m',
    custom_weather_condition_1_day: '30d',
    custom_weather_condition_1_night: '30n',
    custom_weather_condition_1_polartwilight: '30m',
    custom_weather_condition_2_day: '31d',
    custom_weather_condition_2_night: '31n',
    custom_weather_condition_2_polartwilight: '31m',
    heavysleetandthunder: '32',
    lightsnowandthunder: '33',
    heavysnowandthunder: '34',
    lightrainshowers_day: '40d',
    lightrainshowers_night: '40n',
    lightrainshowers_polartwilight: '40m',
    heavyrainshowers_day: '41d',
    heavyrainshowers_night: '41n',
    heavyrainshowers_polartwilight: '41m',
    lightsleetshowers_day: '42d',
    lightsleetshowers_night: '42n',
    lightsleetshowers_polartwilight: '42m',
    heavysleetshowers_day: '43d',
    heavysleetshowers_night: '43n',
    heavysleetshowers_polartwilight: '43m',
    lightsnowshowers_day: '44d',
    lightsnowshowers_night: '44n',
    lightsnowshowers_polartwilight: '44m',
    heavysnowshowers_day: '45d',
    heavysnowshowers_night: '45n',
    heavysnowshowers_polartwilight: '45m',
    lightrain: '46',
    lightsleet: '47',
    heavysleet: '48',
    lightsnow: '49',
    heavysnow: '50'
  }
  return mapping[symbol_code]
}

function getWeatherIcon(city) {
  const weatherData = weatherCache.value[city.place_id];
  if (weatherData) {
    const iconCode = mapWeatherIcon(weatherData.symbol_code)
    return `/pictures/weatherIcons/${iconCode}.svg`
  }
  return 'default-icon.png'
}

function getTemperature(city) {
  const weatherData = weatherCache.value[city.place_id];
  if (weatherData) {
    return weatherData.air_temperature
  }
  return null
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

.star-icon {
  width: 1.2rem;
  height: 1.2rem;
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

.city:hover {
  background-color: #e9e9e9;
  cursor: pointer;
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

.the-searchbar {
  height: 50px;
  border-radius: 10px;
  border: none;
  outline: none;
  padding: 0 20px;
  font-size: 20px;
  font-weight: 500;
  color: #333;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
