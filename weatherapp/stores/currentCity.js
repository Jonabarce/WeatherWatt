import { ref, watch } from 'vue';
import Cookies from 'js-cookie';

export default function useCurrentCityCookieStore() {
  const currentCity = ref(
    Cookies.get('currentCity') ? JSON.parse(Cookies.get('currentCity')) : null
  );

  watch(currentCity, (newValue) => {
    if (newValue) {
      Cookies.set('currentCity', JSON.stringify(newValue));
    } else {
      Cookies.remove('currentCity');
    }
  }, { deep: true });

  function setCurrent(cityData) {
    currentCity.value = {
      display_name: cityData.display_name,
      lat: cityData.lat,
      lon: cityData.lon,
      name: cityData.name,
      place_id: cityData.place_id
    };
  }

  function removeCurrent(placeId) {
    if (currentCity.value && currentCity.value.place_id === placeId) {
      currentCity.value = null;
    }
  }

  function clearCurrent() {
    Cookies.remove('currentCity');
    currentCity.value = null;
  }

  return { currentCity, setCurrent, removeCurrent, clearCurrent };
}
