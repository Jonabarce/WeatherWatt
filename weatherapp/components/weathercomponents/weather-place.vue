<template>
  <div class="header-currentCity-wrapper">
    <h1>{{currentCityName}}</h1>
    <img :src="currentWeatherIcon" alt="">
  </div>
  <div class="the-weatherplace-wrapper">
    <div class="weatherplace-card-wrapper">
      <div class="display">
        <Icon class="umbrella-icon" name="fluent-emoji:thermometer" />
        {{ currentTemprature }}°C
      </div>
      <div class="display">
        <Icon class="umbrella-icon" color="#ff9d00" name="ph:wind-duotone" />
        {{ currentWindSpeed }}
        m/s
      </div>
      <div class="display">
        <Icon
          class="umbrella-icon"
          name="fluent-emoji:umbrella-with-rain-drops"
        />
        {{ currentPrecipitationAmount }} mm
      </div>
    </div>
    <div class="list-of-days">
    <div @click="openModal(dayData), consoleLog(dayData)" class="futuredays" v-for="dayData in futureWeatherData" :key="dayData[0].time">
        <p>
            {{ new Date(dayData[0].time).toLocaleDateString() }}
        </p>
        <div class="weatherIcons">
            <div class="weatherIconsEnter" v-if="shouldDisplayIcon(dayData, 'night')">
                <img :src="'/pictures/weatherIcons/' + getWeatherIconForTime(dayData, 'night') + '.svg'" alt="Night Icon" />
            </div>
            <div class="weatherIconsEnter" v-if="shouldDisplayIcon(dayData, 'morning')">
                <img :src="'/pictures/weatherIcons/' + getWeatherIconForTime(dayData, 'morning') + '.svg'" alt="Morning Icon" />
            </div>
            <div class="weatherIconsEnter" v-if="shouldDisplayIcon(dayData, 'afternoon')">
                <img :src="'/pictures/weatherIcons/' + getWeatherIconForTime(dayData, 'afternoon') + '.svg'" alt="Afternoon Icon" />
            </div>
            <div class="weatherIconsEnter" v-if="shouldDisplayIcon(dayData, 'evening')">
                <img :src="'/pictures/weatherIcons/' + getWeatherIconForTime(dayData, 'evening') + '.svg'" alt="Evening Icon" />
            </div>
        </div>
        </div>
    </div>
    <div v-if="showModal" class="modal">
    <div v-for="hourData in selectedDayData" :key="hourData.time">
      <p>{{ formatLocalTime(hourData.time) }}</p>
      {{ hourData.data.instant.details.air_temperature }}°C
    </div>
    <button @click="closeModal">Lukk</button>
  </div>
  </div>
</template>

<script setup>
import {ref,onMounted } from 'vue'
import axios from 'axios'
import useCookieStore from '/stores/cityStore'
import useCurrentCityStore from '/stores/currentCity'

const currentCityName = ref('')
const currentTemprature = ref('')
const currentWindSpeed = ref('')
const currentWeatherIcon = ref('')
const currentPrecipitationAmount = ref('')
const futureWeatherData = ref([])
const showModal = ref(false)
const selectedDayData = ref([])
const nightTime = 2;
const morningTime = 8;
const afternoonTime = 14;
const eveningTime = 20;



function shouldDisplayIcon(dayData, timeOfDay){
  const currentHour = new Date().getUTCHours();
    const isToday = new Date(dayData[0].time).toDateString() === new Date().toDateString();
    
    if (!isToday) return true;

    switch(timeOfDay) {
      case 'night':
        return currentHour < nightTime;
      case 'morning':
        return currentHour < morningTime;
      case 'afternoon':
        return currentHour < afternoonTime;
      case 'evening':
        return currentHour < eveningTime;
      default:
        return true;
    }
}



function closeModal() {
  showModal.value = false
}


function openModal(dayData) {
  selectedDayData.value = dayData
  showModal.value = true
}



function formatLocalTime(utcTime) {
      const utcDate = new Date(utcTime);
      utcDate.setHours(utcDate.getHours() + 2);
      return utcDate.toISOString().split('T')[1].split(':')[0] + ":00";
    }




const weatherCache = ref({})



const { favorites, addFavorite, removeFavorite, isFavorited, clearFavorites } = useCookieStore()

const { currentCity, setCurrentCity, clearCurrent } = useCurrentCityStore()

onMounted(() => {
  console.log(currentCity.value)
  fetchCurrentWeather(currentCity.value)
  fetchWeatherForwards(currentCity.value)
})




async function fetchCurrentWeather(city) {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${city.lat}&lon=${city.lon}`
  try {
    const response = await axios.get(url)
    const weather = response.data
    console.log(weather)

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

      currentTemprature.value = instantData.air_temperature
      const iconCode = mapWeatherIcon(next1HourData.summary.symbol_code)
      currentWeatherIcon.value = `/pictures/weatherIcons/${iconCode}.svg`
      currentCityName.value = city.name
      currentWindSpeed.value = instantData.wind_speed
      currentPrecipitationAmount.value = next1HourData.details.precipitation_amount



    } else {
      console.error(`Ingen timeseries-data funnet for ${city}`)
    }
  } catch (error) {
    console.error(`En feil oppstod under værhenting for ${city}:`, error)
  }
}



async function fetchWeatherForwards(city) {
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${city.lat}&lon=${city.lon}`;
    try {
        const response = await axios.get(url);
        const weatherData = response.data;

        if (weatherData.properties && weatherData.properties.timeseries) {
            const groupedByDate = {};

            for (let timeseries of weatherData.properties.timeseries) {
                const timeseriesDate = new Date(timeseries.time);
                timeseriesDate.setHours(timeseriesDate.getHours() + 2);

                const dateKey = timeseriesDate.toISOString().split('T')[0];

                if (!groupedByDate[dateKey]) {
                    groupedByDate[dateKey] = [];
                }
                groupedByDate[dateKey].push(timeseries);
            }

            futureWeatherData.value = Object.values(groupedByDate).slice(0, 9);
            console.log(futureWeatherData.value);
        } else {
            console.error(`Ingen timeseries-data funnet for ${city.name}`);
        }
    } catch (error) {
        console.error(`En feil oppstod under værhenting for ${city.name}:`, error);
    }
}






function getWeatherIconForTime(timeseries, timeOfDay) {
  const timePoints = timeseries.map(entry => {
    const hour = new Date(entry.time).getUTCHours();
    return { hour, entry };
  });

  const icons = {
    night: getWeatherIcon(findClosestTime(timePoints, nightTime)),
    morning: getWeatherIcon(findClosestTime(timePoints, morningTime)),
    afternoon: getWeatherIcon(findClosestTime(timePoints, afternoonTime)),
    evening: getWeatherIcon(findClosestTime(timePoints, eveningTime)),
  };

  return icons[timeOfDay];
}

function findClosestTime(timePoints, targetHour) {
  let closestTime = null;
  let closestDiff = Infinity;

  for (const { hour, entry } of timePoints) {
    const diff = Math.abs(hour - targetHour);
    if (diff < closestDiff) {
      closestTime = entry;
      closestDiff = diff;
    }
  }

  return closestTime;
}

function getWeatherIcon(entry) {
  if (entry) {
    let iconCode = null;

    if (entry.data.next_1_hours) {
      iconCode = mapWeatherIcon(entry.data.next_1_hours.summary.symbol_code);
    } else if (entry.data.next_6_hours) {
      iconCode = mapWeatherIcon(entry.data.next_6_hours.summary.symbol_code);
    } else if (entry.data.next_12_hours) {
      iconCode = mapWeatherIcon(entry.data.next_12_hours.summary.symbol_code);
    }

    if (iconCode) {
      
      return iconCode
    }
  }
  return null;
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


</script>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-height: 80%;
  background-color: rgba(0, 0, 0, 0.8);
  display: block;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  z-index: 100;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
}



.futuredays {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.weatherIcons {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.weatherIconsEnter {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.header-currentCity-wrapper{
  display: flex;
}
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
