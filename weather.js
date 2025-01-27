const api_key = 'eaf19ce8536ccd562b3d75020e620b0f';
const aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getWeatherDetails(name, lat, lon, country, state) {
    sessionStorage.setItem('lastSearchedCity', JSON.stringify({ name, lat, lon, country, state }));
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
        AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

    // Fetch для Air Quality
    fetch(AIR_POLLUTION_API_URL)
        .then(res => res.json())
        .then(data => {
            let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
            document.querySelector('.highlights .card').innerHTML = `
                <div class="card-head">
                    <p>Air Quality Index</p>
                    <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
                </div>
                <div class="air-indices">
                    <div class="item"><p>PM2.5</p><h2>${pm2_5}</h2></div>
                    <div class="item"><p>PM10</p><h2>${pm10}</h2></div>
                    <div class="item"><p>SO2</p><h2>${so2}</h2></div>
                    <div class="item"><p>CO</p><h2>${co}</h2></div>
                    <div class="item"><p>NO</p><h2>${no}</h2></div>
                    <div class="item"><p>NO2</p><h2>${no2}</h2></div>
                    <div class="item"><p>NH3</p><h2>${nh3}</h2></div>
                    <div class="item"><p>O3</p><h2>${o3}</h2></div>
                </div>
            `;
        })
        .catch(() => alert('Failed to fetch Air Quality Index'));

    // Fetch для погоды
    fetch(WEATHER_API_URL)
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch weather data");
            return res.json();
        })
        .then(data => {
            let date = new Date();
            document.querySelector('.weather-left .card').innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="fa-solid fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
                    <p><i class="fa-solid fa-location-dot"></i> ${name}, ${country}</p>
                </div>
            `;
            let { sunrise, sunset } = data.sys,
                { timezone, visibility } = data,
                { humidity, pressure, feels_like } = data.main,
                { speed } = data.wind,
                sRiseTime = new Date((sunrise + timezone) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sSetTime = new Date((sunset + timezone) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            document.querySelectorAll('.highlights .card')[1].innerHTML = `
                <div class="card">
                    <div class="card-head">
                        <p>Sunrise & Sunset</p>
                    </div>
                    <div class="sunrise-sunset">
                        <div class="item">
                            <div class="icon">
                                <img src="./sunrise.png" alt="">
                            </div>
                            <div>
                                <p>Sunrise</p>
                                <h2>${sRiseTime}</h2>
                            </div>
                        </div>
                        <div class="item">
                            <div class="icon">
                                <img src="./sunset.png" alt="">
                            </div>
                            <div>
                                <p>Sunset</p>
                                <h2>${sSetTime}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('humidityVal').innerHTML = `${humidity}%`;
            document.getElementById('pressureVal').innerHTML = `${pressure} hPa`;
            document.getElementById('visibilityVal').innerHTML = `${(visibility / 1000).toFixed(1)} km`;
            document.getElementById('windSpeedVal').innerHTML = `${speed} m/s`;
            document.getElementById('feelsVal').innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
        })
        .catch(() => alert('Failed to fetch current weather'));

    fetch(FORECAST_API_URL)
        .then(res => res.json())
        .then(data => {
            let hourlyForecast = data.list;
            document.querySelector('.hourly-forecast').innerHTML = '';
            for (let i = 0; i <= 7; i++) {
                let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
                let hr = hrForecastDate.getHours();
                let a = 'PM';
                if (hr < 12) a = 'AM';
                if (hr === 0) hr = 12;
                if (hr > 12) hr = hr - 12;
                document.querySelector('.hourly-forecast').innerHTML += `
                    <div class="card">
                        <p>${hr} ${a}</p>
                        <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                        <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                    </div>
                `;
            }

            let uniqueForecastDays = [];
            let fiveDaysForecast = data.list.filter(forecast => {
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            document.querySelector('.day-forecast').innerHTML = '';
            for (let i = 0; i < fiveDaysForecast.length; i++) {
                let date = new Date(fiveDaysForecast[i].dt_txt);
                document.querySelector('.day-forecast').innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                            <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>
                `;
            }
        })
        .catch(() => alert('Failed to fetch weather forecast'));
}

export function getCityCoordinates() {
    let cityName = document.getElementById('city_input').value.trim();
    document.getElementById('city_input').value = '';
    if (!cityName) {
        alert("Please enter a city name.");
        return;
    }

    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL)
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch city coordinates");
            return res.json();
        })
        .then(data => {
            if (data.length === 0) {
                alert("City not found. Please check the name and try again.");
                return;
            }
            let { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(err => {
            console.error(err);
            alert("Failed to fetch city coordinates. Please try again later.");
        });
}

export function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(position => {
        let { latitude, longitude } = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

        fetch(REVERSE_GEOCODING_URL)
            .then(res => res.json())
            .then(data => {
                let { name, country, state } = data[0];
                getWeatherDetails(name, latitude, longitude, country, state);
            })
            .catch(() => alert('Failed to fetch user coordinates'));
    });
}