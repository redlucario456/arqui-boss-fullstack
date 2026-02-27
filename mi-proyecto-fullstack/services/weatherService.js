const axios = require('axios');
require('dotenv').config();

const obtenerClima = async (ciudad) => {
    const key = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${key}&units=metric&lang=es`;

    try {
        const res = await axios.get(url);
        return {
            temp: res.data.main.temp,
            descripcion: res.data.weather[0].description,
            humedad: res.data.main.humidity,
            viento: res.data.wind && res.data.wind.speed ? +(res.data.wind.speed * 3.6).toFixed(1) : 0,
            nombre: res.data.name
        };
    } catch (error) {
        throw new Error('No se pudo obtener el clima de esa ciudad');
    }
};

// nueva función basada en coordenadas
const obtenerClimaPorCoords = async (lat, lon) => {
    const key = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=es`;

    try {
        const res = await axios.get(url);
        return {
            temp: res.data.main.temp,
            descripcion: res.data.weather[0].description,
            humedad: res.data.main.humidity,
            viento: res.data.wind && res.data.wind.speed ? +(res.data.wind.speed * 3.6).toFixed(1) : 0,
            nombre: res.data.name
        };
    } catch (error) {
        throw new Error('No se pudo obtener el clima para las coordenadas');
    }
};

module.exports = { obtenerClima, obtenerClimaPorCoords };