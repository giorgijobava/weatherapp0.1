import { getCityCoordinates, getUserCoordinates } from './weather.js';
import { darkmode } from './darkmode.js';

export function setupEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', getCityCoordinates);
    document.getElementById('locationBtn').addEventListener('click', getUserCoordinates);
    document.querySelector('#btn2').addEventListener('click', darkmode);

    document.getElementById('aboutBtn1').addEventListener('click', function () {
        window.location.href = 'details.html';
    });

    document.getElementById('aboutBtn2').addEventListener('click', () => {
        window.location.href = 'katalog.html';
    });
}
