import { getWeatherDetails, getCityCoordinates, getUserCoordinates } from './weather.js';
import { darkmode } from './darkmode.js';
import { setupEventListeners } from './events.js';

setupEventListeners();

if (sessionStorage.getItem('lastSearchedCity')) {
    let lastCity = JSON.parse(sessionStorage.getItem('lastSearchedCity'));
    getWeatherDetails(lastCity.name, lastCity.lat, lastCity.lon, lastCity.country, lastCity.state);
}
