const weatherBackgrounds = {
    snow: 'https://i.imgur.com/ZSY7z89.jpeg',
    rain: 'https://i.imgur.com/jxRGSqO.jpeg',
    overcast: 'https://images.pexels.com/photos/29968129/pexels-photo-29968129/free-photo-of-cape-disappointment-lighthouse-on-a-cloudy-day.jpeg',
    sunny: 'https://images.pexels.com/photos/912364/pexels-photo-912364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    cloudy: 'https://images.pexels.com/photos/912364/pexels-photo-912364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    storm: 'https://i.imgur.com/MZ65XwL.jpeg'
};

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f30fcffc99cf4e1d2a78c30300a47ed2&units=metric`;

            fetch(weatherUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        displayWeather(data);
                        changeBackground(data.weather[0].description);
                    } else {
                        showError('Unable to retrieve weather data.');
                    }
                })
                .catch(err => showError('Error fetching weather data.'));
        });
    } else {
        showError('Geolocation is not supported by this browser.');
    }
}

function searchWeather() {
    const city = document.getElementById('city-input').value.trim();

    if (city) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f30fcffc99cf4e1d2a78c30300a47ed2&units=metric`;

        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    displayWeather(data);
                    changeBackground(data.weather[0].description);
                } else {
                    showError('City not found.');
                }
            })
            .catch(err => showError('Error fetching weather data.'));
    } else {
        showError('Please enter a city name.');
    }
}

function displayWeather(weatherData) {
    const location = weatherData.name + ', ' + weatherData.sys.country;
    const temperature = weatherData.main.temp;
    const description = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const feelsLike = weatherData.main.feels_like;
    const windSpeed = weatherData.wind.speed;
    const uvIndex = 'N/A';
    const dewPoint = weatherData.main.dew_point;
    const visibility = weatherData.visibility / 1000;

    document.getElementById('location').innerHTML = `
        <span class="location-text">Location:</span>
        <span class="actual-location">${location}</span>
    `;
    document.getElementById('temperature').textContent = `${temperature} °C`;
    document.getElementById('description').textContent = description;
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('feels-like').textContent = `${feelsLike} °C`;
    document.getElementById('wind-speed').textContent = `${windSpeed} m/s`;
    document.getElementById('uv-index').textContent = `${uvIndex}`;
    document.getElementById('dew-point').textContent = `${dewPoint} °C`;
    document.getElementById('visibility').textContent = `${visibility} km`;
    document.getElementById('error-message').textContent = '';
}

function changeBackground(description) {
    let backgroundUrl;

    if (description.includes('snow')) {
        backgroundUrl = weatherBackgrounds.snow;
    } else if (description.includes('rain')) {
        backgroundUrl = weatherBackgrounds.rain;
    } else if (description.includes('clouds') || description.includes('overcast')) {
        backgroundUrl = weatherBackgrounds.overcast;
    } else if (description.includes('clear') || description.includes('sun')) {
        backgroundUrl = weatherBackgrounds.sunny;
    } else if (description.includes('storm')) {
        backgroundUrl = weatherBackgrounds.storm;
    } else {
        backgroundUrl = weatherBackgrounds.cloudy;
    }

    document.body.style.backgroundImage = `url(${backgroundUrl})`;
}

function showError(message) {
    document.getElementById('location').textContent = 'Unable to retrieve location';
    document.getElementById('temperature').textContent = '-- °C';
    document.getElementById('description').textContent = '--';
    document.getElementById('humidity').textContent = '--%';
    document.getElementById('feels-like').textContent = '-- °C';
    document.getElementById('wind-speed').textContent = '-- m/s';
    document.getElementById('uv-index').textContent = '--';
    document.getElementById('dew-point').textContent = '-- °C';
    document.getElementById('visibility').textContent = '-- km';
    document.getElementById('error-message').textContent = message;
}

// Call getLocationWeather when the page loads
getLocationWeather();
