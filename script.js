const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");

const weatherTitle = document.getElementById("weather-title");

const cityName = document.getElementById("city-name");
const currentDate = document.getElementById("current-date");
const heroTemperature = document.getElementById("hero-temperature");
const heroIcon = document.getElementById("hero-icon");

const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const precipitation = document.getElementById("precipitation");

const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");

const dailyForecastList = document.getElementById("daily-forecast-list");
const hourlyForecastList = document.getElementById("hourly-forecast-list");
const searchHistory = document.getElementById("history")

const temperatureUnit = document.getElementById("temperature-unit");
const windUnit = document.getElementById("wind-unit");
const precipitationUnit = document.getElementById("precipitation-unit");


function getWeatherIcon(code) {

    if (code === 0)
        return `<img src="./assets/images/icon-sunny.webp" class="weather-icon">`;

    if (code >= 1 && code <= 3)
        return `<img src="./assets/images/icon-partly-cloudy.webp" class="weather-icon">`;

    if (code >= 45 && code <= 48)
        return `<img src="./assets/images/icon-fog.webp" class="weather-icon">`;

    if (code >= 51 && code <= 67)
        return `<img src="./assets/images/icon-rain.webp" class="weather-icon">`;

    if (code >= 71 && code <= 77)
        return `<img src="./assets/images/icon-snow.webp" class="weather-icon">`;
//rain icon hato te change kryo 6
    if (code >= 80 && code <= 82)
        return `<img src="./assets/images/icon-snow.webp" class="weather-icon">`;

    if (code >= 95)
        return `<img src="./assets/images/icon-storm.webp" class="weather-icon">`;

    return `<img src="./assets/images/icon-overcast.webp" class="weather-icon">`;
}

function setWeatherBackground(code) {

    let background = "";

    if (code === 0) {
        background = "./assets/images/backgrounds/sunny.png";
    }
    else if (code >= 1 && code <= 3) {
        background = "./assets/images/backgrounds/cloudy.png";
    }
    else if (code >= 45 && code <= 48) {
        background = "./assets/images/backgrounds/foggy.png";
    }
    else if (code >= 51 && code <= 67) {
        background = "./assets/images/backgrounds/rainy.png";
    }
    else if (code >= 71 && code <= 77) {
        background = "./assets/images/backgrounds/snowy.png";
    }
    //2 var snowy lidhu 6
    else if (code >= 80 && code <= 82) {
        background = "./assets/images/backgrounds/snowy.png";
    }
    else if (code >= 95) {
        background = "./assets/images/backgrounds/stormy.png";
    }
    else {
        background = "./assets/images/backgrounds/cloudy.png";
    }

    document.body.style.backgroundImage = `url("${background}")`;
}


searchButton.addEventListener("click", searchWeather);

cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        searchWeather();
    }

});


function searchWeather() {

    const city = cityInput.value.trim();

    if (city === "") 
        
        {

        errorMessage.textContent = "Please enter a city.";

        return;
    }
     if(!
        searchHistory.innerText.includes(city))
        {
    searchHistory.innerHTML = `<p>${city}</p>` + searchHistory.innerHTML;
     }

    loadingMessage.textContent = "Loading weather...";
    errorMessage.textContent = "";

    weatherTitle.textContent =  `How's the sky looking in ${city}?`;


    const geocodingUrl =
        "https://geocoding-api.open-meteo.com/v1/search?name=" +
        encodeURIComponent(city) +
        "&count=1&language=en&format=json";


    fetch(geocodingUrl)

        .then(response => response.json())

        .then(locationData => {

            if (!locationData.results) {

                loadingMessage.textContent = "";
                errorMessage.textContent = "City not found.";

                return;
            }


            const location = locationData.results[0];

            cityName.textContent = location.name;


           const weatherUrl =
        "https://api.open-meteo.com/v1/forecast?" +
        "latitude=" + location.latitude +
        "&longitude=" + location.longitude +
         "&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code" +
         "&hourly=temperature_2m,weather_code" +
         "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
          "&temperature_unit=" + temperatureUnit.value +
         "&wind_speed_unit=" + windUnit.value +
          "&precipitation_unit=" + precipitationUnit.value +
            "&forecast_days=7" +
             "&timezone=auto";


            return fetch(weatherUrl);

        })


        .then(response => response.json())


        .then(data => 
            
            {

            loadingMessage.textContent = "";


            const date = new Date(data.current.time);


            currentDate.textContent =  date.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric"

                });


            heroTemperature.textContent = Math.round(data.current.temperature_2m) + 
               (temperatureUnit.value ===
                "fahrenheit" ? "°F" : "°C");


      
            heroIcon.innerHTML = getWeatherIcon(data.current.weather_code);
            console.log("current code",data.current.weather_code)
            setWeatherBackground(data.current.weather_code);

            temperature.textContent = Math.round(data.current.apparent_temperature) + 
               (temperatureUnit.value ===
                "fahrenheit" ? "°F" : "°C");
               


            humidity.textContent = data.current.relative_humidity_2m + "%";


            wind.textContent =  data.current.wind_speed_10m + " " + windUnit.value;


            precipitation.textContent = data.current.precipitation + " " + precipitationUnit.value;


            dailyForecastList.innerHTML = "";
            hourlyForecastList.innerHTML = "";


            

            for (let i = 0; i < data.daily.time.length; i++) {

                const card = document.createElement("div");

                card.className = "forecast-card";


                const date = new Date(data.daily.time[i]);


                const day = date.toLocaleDateString("en-US", {
                    weekday: "short"
                });


                const icon = getWeatherIcon(data.daily.weather_code[i]);


                card.innerHTML = `

                    <h3>${day}</h3>

                    <div class="forecast-icon">
                        ${icon}
                    </div>

                    <p>
                        
                        ${Math.round(data.daily.temperature_2m_max[i])}
                    </p>

                    <p>
                        
                        ${Math.round(data.daily.temperature_2m_min[i])}
                    </p>

                `;


                dailyForecastList.appendChild(card);

            }


        

            for (let i = 0; i < 7; i++) {

                const hourCard =  document.createElement("div");


                hourCard.className = "hour-card";


                const time =  new Date(data.hourly.time[i]);


                const hour =  time.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        hour12: true
                    });


                const icon = getWeatherIcon(data.hourly.weather_code[i]);


                hourCard.innerHTML = `

                    <div class="hour-time">
                        ${hour}
                    </div>

                    <div class="hour-icon">
                        ${icon}
                    </div>

                    <div class="hour-temp">
                        ${Math.round(data.hourly.temperature_2m[i])}°
                    </div>

                `;


                hourlyForecastList.appendChild(hourCard);

            }

        })


        .catch(error => {

            console.error(error);

            loadingMessage.textContent = "";

            errorMessage.textContent =  "Something went wrong. Please try again.";

        });

}

cityInput.addEventListener("focus", function () {
    searchHistory.style.display = "block";
});

document.addEventListener("click", function (e) {
    if (!e.target.closest(".search-box")) {
        searchHistory.style.display = "none";
    }
});


searchHistory.addEventListener("click",
    function(e){
        if (e.target.tagName === "P"){
            cityInput.value = 
            e.target.textContent;
            searchWeather();
            searchHistory.style.display = 
            "none";
        }
});

temperatureUnit.addEventListener("change", searchWeather);
windUnit.addEventListener("change", searchWeather);
precipitationUnit.addEventListener("change", searchWeather);