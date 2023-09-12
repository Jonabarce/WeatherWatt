import { ref } from 'vue'
import Cookies from 'js-cookie'

export default function useCookieStore() {
  const favorites = ref(
    Cookies.get('favorites') ? JSON.parse(Cookies.get('favorites')) : []
  )

  function addFavorite(cityData) {
    const city = {
      display_name: cityData.display_name,
      lat: cityData.lat,
      lon: cityData.lon,
      name: cityData.name
    }

    const index = favorites.value.findIndex(
      (favCity) => favCity.display_name === city.display_name
    )

    if (index === -1) {
      favorites.value.push(city)
      Cookies.set('favorites', JSON.stringify(favorites.value))
    }
  }

  function removeFavorite(display_name) {
    favorites.value = favorites.value.filter(
      (favCity) => favCity.display_name !== display_name
    )
    Cookies.set('favorites', JSON.stringify(favorites.value))
  }

  function isFavorited(display_name) {
    return favorites.value.some(
      (favCity) => favCity.display_name === display_name
    )
  }

  function clearFavorites() {
    Cookies.remove('favorites')
    favorites.value = []
  }

  return { favorites, addFavorite, removeFavorite, isFavorited, clearFavorites }
}
