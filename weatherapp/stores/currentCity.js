import { ref, watch, onMounted } from 'vue'

export default function useCurrentCityStore() {
  const currentCity = ref(null)

  onMounted(() => {
    const storedCity = JSON.parse(
      sessionStorage.getItem('currentCity') || 'null'
    )
    currentCity.value = storedCity
  })

  watch(
    currentCity,
    (newValue) => {
      if (process.client) {
        if (newValue) {
          sessionStorage.setItem('currentCity', JSON.stringify(newValue))
        } else {
          sessionStorage.removeItem('currentCity')
        }
      }
    },
    { deep: true }
  )

  function setCurrent(cityData) {
    currentCity.value = {
      display_name: cityData.display_name,
      lat: cityData.lat,
      lon: cityData.lon,
      name: cityData.name,
      place_id: cityData.place_id
    }
  }

  function removeCurrent(placeId) {
    if (currentCity.value && currentCity.value.place_id === placeId) {
      currentCity.value = null
    }
  }

  function clearCurrent() {
    currentCity.value = null
  }

  return { currentCity, setCurrent, removeCurrent, clearCurrent }
}
