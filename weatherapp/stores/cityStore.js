import { ref } from 'vue'
import Cookies from 'js-cookie'

export default function useCookieStore() {
  const favorites = ref(
    Cookies.get('favorites') ? JSON.parse(Cookies.get('favorites')) : []
  )

  function addFavorite(city) {
    if (!favorites.value.includes(city)) {
      favorites.value.push(city)
      Cookies.set('favorites', JSON.stringify(favorites.value))
    }
  }

  function removeFavorite(city) {
    favorites.value = favorites.value.filter((favCity) => favCity !== city)
    Cookies.set('favorites', JSON.stringify(favorites.value))
  }

  function isFavorited(city) {
    console.log(favorites.value.includes(city))
    return favorites.value.includes(city)
  }

  function clearFavorites() {
    Cookies.remove('favorites')
    favorites.value = []
  }

  return { favorites, addFavorite, removeFavorite, isFavorited, clearFavorites}
}
