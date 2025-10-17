const apiKey = "666ed394f86b82d1f041054e491e7ec4";

// Cape Town Areas & Coordinates
const cityCoords = {
  "cape town": { lat: -33.9249, lon: 18.4241 },
  "green point": { lat: -33.9115, lon: 18.4083 },
  "blouberg": { lat: -33.7796, lon: 18.4783 },
  "table view": { lat: -33.8478, lon: 18.4941 },
  "claremont": { lat: -33.9860, lon: 18.4650 },
  "rylands": { lat: -33.9234, lon: 18.5476 },
  "woodstock": { lat: -33.9267, lon: 18.4432 },
  "constantia": { lat: -34.0000, lon: 18.4526 },
  "hout bay": { lat: -34.0346, lon: 18.3405 },
  "stellenbosch": { lat: -33.9349, lon: 18.8662 }
};

// Convert condition to emoji
function getWeatherEmoji(condition) {
  switch (condition.toLowerCase()) {
    case 'clear': return '☀️';
    case 'clouds': return '☁️';
    case 'rain': return '🌧️';
    case 'drizzle': return '🌦️';
    case 'thunderstorm': return '⛈️';
    case 'snow': return '❄️';
    case 'mist':
    case 'fog': return '🌫️';
    default: return '🌡️';
  }
}

// Generate a more human-like weather description
function generateDescription(condition, temp, timeOfDay) {
  const hour = new Date().getHours();
  let timeLabel = timeOfDay || (hour < 12 ? "this morning" : hour < 18 ? "this afternoon" : "tonight");

  const details = {
    clear: `Expect sunny skies ${timeLabel}. Temperatures around ${temp}°C.`,
    clouds: `Mostly cloudy ${timeLabel} with mild temperatures near ${temp}°C.`,
    rain: `Rain showers expected ${timeLabel}. Carry an umbrella just in case! 🌧️`,
    drizzle: `Light drizzle likely ${timeLabel}, temperatures about ${temp}°C.`,
    thunderstorm: `Thunderstorms may develop ${timeLabel}. Stay indoors if possible. ⛈️`,
    snow: `Snowfall likely ${timeLabel}. Bundle up and drive safely. ❄️`,
    mist: `Misty and cool ${timeLabel} with temperatures near ${temp}°C.`,
    fog: `Foggy conditions ${timeLabel}, visibility may be low.`,
    default: `Conditions look moderate ${timeLabel} with around ${temp}°C.`
  };
  return details[condition.toLowerCase()] || details.default;
}

// Elements
const checkBtn = document.getElementById("checkWeatherBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const alertContainer = document.getElementById("alertCards");

// Fetch weather data
async function getWeather(city) {
  const coords = cityCoords[city.toLowerCase()];
  if (!coords) {
    weatherInfo.innerHTML = `<p>City not found!</p>`;
    alertContainer.innerHTML = '';
    return;
  }

  try {
    // Current Weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`
    );
    const currentData = await currentRes.json();
    if (currentData.cod !== 200) throw new Error(currentData.message);

    const temp = currentData.main.temp.toFixed(1);
    const condition = currentData.weather[0].main;
    const description = currentData.weather[0].description;
    const emoji = getWeatherEmoji(condition);

    // Generate natural summary
    const readableDescription = generateDescription(condition, temp);

    // South African Time (UTC+2)
    const checkedTime = new Date().toLocaleString('en-ZA', {
      timeZone: 'Africa/Johannesburg',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    // 3-Day Forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&cnt=24&appid=${apiKey}`
    );
    const forecastData = await forecastRes.json();
    if (forecastData.cod !== "200") throw new Error(forecastData.message);

    let forecastHTML = '<div class="forecast-container">';
    for (let i = 0; i < 3; i++) {
      const dayData = forecastData.list[i * 8];
      const date = new Date(dayData.dt * 1000);
      const dayName = date.toLocaleDateString('en-ZA', { weekday: 'short' });
      const tempDay = dayData.main.temp.toFixed(1);
      const conditionDay = dayData.weather[0].main;
      const time = date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
      const summary = generateDescription(conditionDay, tempDay, `around ${time}`);
      forecastHTML += `
        <div class="forecast-box">
          <h3>${dayName}</h3>
          <p>${getWeatherEmoji(conditionDay)} ${conditionDay}</p>
          <p>🌡️ ${tempDay}°C</p>
          <p style="font-size:14px; opacity:0.9;">${summary}</p>
        </div>
      `;
    }
    forecastHTML += '</div>';

    // Simple alert system
    const severeConditions = ['thunderstorm', 'rain', 'snow'];
    const alertHTML = severeConditions.includes(condition.toLowerCase())
      ? `<div class="alert-card"><p>⚠️ Alert: ${condition} expected today. Stay safe and plan ahead.</p></div>`
      : `<div class="alert-card safe"><p>No severe weather alerts 🌤️</p></div>`;

    // Display results
    weatherInfo.innerHTML = `
      <div class="weather-card">
        <h2>${city.charAt(0).toUpperCase() + city.slice(1)}</h2>
        <div class="weather-details">
          <p class="temp">${emoji} ${temp}°C</p>
          <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
          <p>${readableDescription}</p>
          <p style="font-size:13px; color:#bbb;">🕒 Checked at: ${checkedTime} (South Africa Time)</p>
        </div>
      </div>
      ${forecastHTML}
    `;
    alertContainer.innerHTML = alertHTML;

  } catch (error) {
    weatherInfo.innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
    alertContainer.innerHTML = '';
    console.error(error);
  }
}

// Event listener
checkBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
  else alert("Please enter a city name.");
});

// ===== SUBSCRIBE BUTTON FUNCTIONALITY =====
const subscribeBtn = document.getElementById("subscribeBtn");
const userEmail = document.getElementById("userEmail");
const subscribeMsg = document.getElementById("subscribeMsg");

subscribeBtn.addEventListener("click", () => {
  const email = userEmail.value.trim();
  
  if (!email) {
    subscribeMsg.style.color = "yellow";
    subscribeMsg.textContent = "⚠️ Please enter your email before subscribing.";
    return;
  }

  // Simulate successful subscription
  subscribeMsg.style.color = "lightgreen";
  subscribeMsg.textContent = `✅ ${email} has successfully subscribed to WeatherWise alerts!`;

  // Clear email input after a short delay
  setTimeout(() => {
    userEmail.value = "";
  }, 1500);
});
