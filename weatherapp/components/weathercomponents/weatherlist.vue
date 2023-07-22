<template>
  <div class="the-weather-list-wrapper">
    <ul class="cities">
      <li v-for="city in allCitiesOrdered" :key="city" class="city">
        <button
          @click="isFavorited(city) ? removeFavorite(city) : addFavorite(city)"
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
        <img :src="getWeatherIcon(city)" alt="vær icon">
        <span class="city-name">{{ city }}</span>
        <span class="city-name">{{ getWeather(city) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import useCookieStore from '/stores/cityStore'

const allCities = ['Oslo', 'Bergen', 'Stavanger', 'Trondheim', 'Tromsø']
const { favorites, addFavorite, removeFavorite, isFavorited } = useCookieStore()

const nonFavoritedCities = computed(() => {
  return allCities.filter((city) => !favorites.value.includes(city))
})

const allCitiesOrdered = computed(() => {
  return [...favorites.value, ...nonFavoritedCities.value]
})


async function getWeatherIcon(city) {
  // Hent breddegrad og lengdegrad for byen fra OpenStreetMap Nominatim
  const query = encodeURIComponent(city);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  // Utfør AJAX-kall for å hente breddegrad og lengdegrad fra OpenStreetMap Nominatim
  // Bruk async/await for å vente på responsen fra AJAX-kallet
  const response = await fetch(url);
  const data = await response.json();

  if (data.length > 0) {
    const { lat, lon } = data[0];

    // Bruk breddegrad og lengdegrad til å generere riktig API-kall
    const apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

    // Utfør AJAX-kall for å hente værdata fra API-et
    const weatherResponse = await fetch(apiUrl);
    const weatherData = await weatherResponse.json();

    // Hent ut symbol_code fra værdata og generer URL-en til vær-ikonet
    const symbolCode = weatherData.properties.timeseries[0].data.next_1_hours.summary.symbol_code;
    const iconUrl = `https://api.met.no/weatherapi/weathericon/2.0/data?symbol=${symbolCode}&content_type=image/png`;

    return iconUrl;
  }
  return ''; // Returner en tom streng hvis det ikke ble funnet breddegrad og lengdegrad for byen
}

async function getWeather(city) {
  // Hent breddegrad og lengdegrad for byen fra OpenStreetMap Nominatim
  const query = encodeURIComponent(city);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  // Utfør AJAX-kall for å hente breddegrad og lengdegrad fra OpenStreetMap Nominatim
  // Bruk async/await for å vente på responsen fra AJAX-kallet
  const response = await fetch(url);
  const data = await response.json();
  if (data.length > 0) {
    const { lat, lon } = data[0];

    // Bruk breddegrad og lengdegrad til å generere riktig API-kall
    const apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

    // Utfør AJAX-kall for å hente værdata fra API-et
    const weatherResponse = await fetch(apiUrl);
    const weatherData = await weatherResponse.json();

    // Hent ut relevant værdata fra weatherData-objektet og returner det
    // Du kan bruke weatherData-objektet til å hente ut ønskede værdata, f.eks. air_temperature, precipitation_amount, osv.
    console.log(weatherData);
    return weatherData; // Returner værdata for byen
  }
  return ''; // Returner en tom streng hvis det ikke ble funnet breddegrad og lengdegrad for byen
}
</script>

<style scoped>
.the-weather-list-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.title-weather-list {
  font-size: 3em;
  font-weight: bold;
}

.cities {
  list-style-type: none;
}

.city {
  margin-bottom: 0.5em;
  border: 2px black solid;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
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
