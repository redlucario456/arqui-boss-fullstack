const { obtenerClima, obtenerClimaPorCoords } = require("../services/weatherService");

const obtenerClimaCtrl = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    let data;

    if (city) {
      data = await obtenerClima(city);
    } else if (lat && lon) {
      data = await obtenerClimaPorCoords(lat, lon);
    } else {
      // fallback to a default city
      data = await obtenerClima("Monterrey");
    }

    // build recommendation
    let recomendacion = "";
    if (data.temp > 30) {
      recomendacion = "Hace mucho calor ";
    } else if (data.temp < 10) {
      recomendacion = "Hace frío ";
    } else {
      recomendacion = "Clima agradable ";
    }

    res.json({
      temperatura: data.temp,
      viento: data.viento || 0,
      recomendacion,
      nombre: data.nombre || "",
      lat: lat || null,
      lon: lon || null
    });

  } catch (error) {
    console.error('climaController error:', error.message);
    res.status(500).json({ msg: "Error al obtener clima" });
  }
};

module.exports = { obtenerClima: obtenerClimaCtrl };