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
      name: cityData.name,
      place_id: cityData.place_id
    }

    const index = favorites.value.findIndex(
      (favCity) => favCity.place_id === city.place_id
    )

    if (index === -1) {
      favorites.value.push(city)
      Cookies.set('favorites', JSON.stringify(favorites.value), { expires: 365 });
    }
  }

  function removeFavorite(placeId) {
    const index = favorites.value.findIndex((city) => city.place_id === placeId)

    if (index !== -1) {
      favorites.value.splice(index, 1)
      Cookies.set('favorites', JSON.stringify(favorites.value), { expires: 365 });
    }
  }

  function isFavorited(placeId) {
    return favorites.value.some((city) => city.place_id === placeId)
  }

  function clearFavorites() {
    Cookies.remove('favorites')
    favorites.value = []
  }

  return { favorites, addFavorite, removeFavorite, isFavorited, clearFavorites }
}
