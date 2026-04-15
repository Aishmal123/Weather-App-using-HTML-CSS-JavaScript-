const apiKey = `5eb36db336f941af625d0976dafbbcb3`;
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const locationName = document.getElementById("location-name");
const mainTemp = document.getElementById("main-temp");
const currentTime = document.getElementById("current-time");
const weatherDesc = document.getElementById("weather-description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity-val");
const wind = document.getElementById("wind-val");
const visibility = document.getElementById("visibility-val");
const pressure = document.getElementById("pressure-val");
const forecastContainer = document.getElementById("forecast-container");
const longitude= document.getElementById("lon-val");
const latitude= document.getElementById("lat-val");

async function checkWeather(city) {
  locationName.innerText = "Loading...";
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();

    if (data.cod === 200) {
      updateMainUI(data);
      getForecast(city);
    } else {
      alert("City not found!");
    }
  } catch (error) {
    console.error(error);
  }
}

function updateMainUI(data) {
  locationName.innerText = data.name;
  mainTemp.innerText = Math.round(data.main.temp) + "°C";
  
  const desc = data.weather[0].description;
  weatherDesc.innerText = desc.charAt(0).toUpperCase() + desc.slice(1);
  
  feelsLike.innerText = Math.round(data.main.feels_like) + "°C";
  humidity.innerText = data.main.humidity + "%";
  wind.innerText = data.wind.speed + " km/h";
  visibility.innerText = (data.visibility / 1000).toFixed(1) + " km";
  pressure.innerText = data.main.pressure + " hPa";
  longitude.innerText = data.coord.lon;
  latitude.innerText = data.coord.lat;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  let mainImg = document.querySelector(".main-weather-icon");
  if (!mainImg) {
    const mainIconI = document.querySelector(".main-info i");
    if (mainIconI) {
      mainIconI.outerHTML = `<img src="${iconUrl}" alt="weather" class="main-weather-icon">`;
    }
  } else {
    mainImg.src = iconUrl;
  }

  const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
  const cityTime = new Date(utc + (data.timezone * 1000));
  
  currentTime.innerText = cityTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

async function getForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();

    forecastContainer.innerHTML = "";
    
    const dailyData = [];
    const seenDates = new Set();

    data.list.forEach((forecast) => {
      const date = forecast.dt_txt.split(" ")[0]; 
      if (!seenDates.has(date)) {
        dailyData.push(forecast);
        seenDates.add(date);
      }
    });

    dailyData.slice(0, 5).forEach((dayData, index) => {
      const dateObj = new Date(dayData.dt * 1000);
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
      
      const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const displayName = (dayName === todayName) ? "Today" : dayName;

      const iconCode = dayData.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

      const card = document.createElement("div");
      card.className = "day-card";
      if (index === 0) card.classList.add("active");
      
      card.innerHTML = `
        <p class="day">${displayName}</p>
        <img src="${iconUrl}" alt="icon" class="card-icon">
        <p class="temp">${Math.round(dayData.main.temp)}°C</p>
      `;

      card.addEventListener("click", () => {
        document.querySelectorAll(".day-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active"); 
        updateMainFromForecast(dayData, data.city.timezone);
      });

      forecastContainer.appendChild(card);
    });

  } catch (error) {
    console.error(error);
  }
}

function updateMainFromForecast(dayData, timezone) {
  mainTemp.innerText = Math.round(dayData.main.temp) + "°C";
  const desc = dayData.weather[0].description;
  weatherDesc.innerText = desc.charAt(0).toUpperCase() + desc.slice(1);
  feelsLike.innerText = Math.round(dayData.main.feels_like) + "°C";
  humidity.innerText = dayData.main.humidity + "%";
  wind.innerText = dayData.wind.speed + " km/h";
 lonVal.innerText = data.coord.lon;
latVal.innerText = data.coord.lat;


  const iconCode = dayData.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const mainImg = document.querySelector(".main-weather-icon");
  if (mainImg) mainImg.src = iconUrl;

  const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
  const cityTime = new Date(utc + (timezone * 1000));
  currentTime.innerText = cityTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (cityInput.value.trim() !== "") {
    checkWeather(cityInput.value);
  }
});

checkWeather("Lahore");