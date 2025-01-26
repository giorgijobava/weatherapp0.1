const apiKey = 'eaf19ce8536ccd562b3d75020e620b0f';
const cities = ['New York', 'London', 'Tokyo', 'Tbilisi', 'Dubai', 'France', 'Istanbul', 'Italy', 'Germany'];

const slides = document.querySelectorAll('.weather-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const pageButtons = document.querySelectorAll('.page-btn');

let currentSlide = 0; 

const showSlide = (index) => {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    pageButtons.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;
};

prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
    }
});

pageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const slideIndex = parseInt(btn.dataset.slide, 10) - 1;
        currentSlide = slideIndex;
        showSlide(currentSlide);
    });
});

showSlide(currentSlide);

const fetchWeather = (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => updateWeatherCard(city, data))
        .catch(error => console.log("Error fetching weather data: ", error));
};

const updateWeatherCard = (city, data) => {
    const card = document.getElementById(city.toLowerCase().replace(' ', '-'));
    if (!card) return; 

    const temperature = card.querySelector('.temperature');
    const humidity = card.querySelector('.humidity');
    const wind = card.querySelector('.wind');
    const dateTime = card.querySelector('.date-time');

    temperature.textContent = `${data.main.temp}°C`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    const date = new Date(data.dt * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    dateTime.textContent = `Last updated: ${formattedDate}`;
};

document.getElementById('backBtn').addEventListener('click', function() {
    window.location.href = 'index.html'; 
    
});

cities.forEach(city => fetchWeather(city));