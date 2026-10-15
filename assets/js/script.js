// selected Element
const addBtn = document.querySelector("#topBtn");
const mainbox = document.querySelector(".main-box");
const cards = document.querySelector(".flex");
const WEATHER_STORAGE_KEY = "weather-app-cities";
const weatherItems = loadWeatherItems();

// event
addBtn.addEventListener("click", test);
weatherItems.forEach(renderWeatherCard);

// functions
async function test() {
  const result = await Swal.fire({
    title: "Enter city name",
    input: "text",
    showCancelButton: true,
    confirmButtonText: "Add",
    customClass: {
      confirmButton: "swal-confirm",
      cancelButton: "swal-cancel",
    },
    preConfirm: getWeatherApi,
  });

  if (result.isConfirmed && result.value) {
    weatherItems.push(result.value);
    renderWeatherCard(result.value);
    saveWeatherItems();
  }
}

function renderWeatherCard(weather) {
  const card = document.createElement("div");
  card.className = "col-md-3";

  const content = document.createElement("div");
  content.className = "box-flx";

  const info = document.createElement("div");
  info.className = "info";

  const temperature = document.createElement("h6");
  temperature.className = "number";
  temperature.textContent = `${weather.current.temp_c}°C`;

  const condition = document.createElement("span");
  condition.className = "subtitle";
  condition.textContent = weather.current.condition.text;

  const logo = document.createElement("div");
  logo.className = "logo";

  const icon = document.createElement("img");
  icon.src = `https:${weather.current.condition.icon}`;
  icon.alt = weather.current.condition.text;

  const country = document.createElement("span");
  country.className = "country";
  country.textContent = `${weather.location.name} / ${weather.location.country}`;

  info.append(temperature, condition);
  logo.append(icon);
  content.append(info, logo);
  card.append(content, country);
  cards.append(card);
}

function loadWeatherItems() {
  try {
    const storedItems = localStorage.getItem(WEATHER_STORAGE_KEY);
    if (!storedItems) return [];

    const items = JSON.parse(storedItems);
    if (!Array.isArray(items) || !items.every(isWeatherItem)) {
      throw new Error("Saved weather data has an invalid format.");
    }
    return items;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Could not load saved weather",
      text: error.message,
    });
    return [];
  }
}

function isWeatherItem(item) {
  return (
    item &&
    typeof item.location?.name === "string" &&
    typeof item.location?.country === "string" &&
    typeof item.current?.temp_c === "number" &&
    typeof item.current?.condition?.text === "string" &&
    typeof item.current?.condition?.icon === "string"
  );
}

function saveWeatherItems() {
  try {
    localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(weatherItems));
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Could not save weather",
      text: error.message,
    });
  }
}

async function getWeatherApi(cityName) {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=b32bc7c9d65c41b9b99164628262209&q=${cityName}`,
    );
    const data = await res.json();
    if (res.ok === false) throw new Error(data.error.message);
    return data;
  } catch (error) {
    Swal.showValidationMessage(error.message);
  }
}
