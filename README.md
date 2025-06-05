# 🌤️ Weather API

A lightweight wrapper around [WeatherAPI.com](https://www.weatherapi.com/) that fetches weather data.

---

## Installation

```bash
npm install @loybung/weather-api
```

---

## Quick Example

```ts
const { Weather } = require("@loybung/weather-api");

const weather = new Weather({ apiKey: "your_api_key_here" });

async function run() {
	const current = await weather.current("New York");
	console.log(current);
}

run();
```