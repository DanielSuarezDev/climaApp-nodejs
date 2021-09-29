const fs= require('fs')
const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath = './db/database.json'

  constructor() {
    // leer db si existe
    this.leerDB()
  }

  get parmamsMapbox() {
    return {
          "access_token":process.env.MAPBOX_KEY,
          "limit": 5,
          "language": 'es',
    }
  }

  get paramsTemp() {
    return {
                // lat,
                // lon,
                "appid": process.env.OPENWEATHER_KEY,
                units: 'metric',
                lang: 'es'
              }
  }

  async ciudad(lugar = "") {
    try {
      //peticion http

      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.parmamsMapbox
      });

      const resp = await instance.get();

      return resp.data.features.map( lugar => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1]

      }))
    } catch (error) {
      return [];
    }
    
  }


  async climaLugar( lat, lon) {
    try {
      
      //instancia axios.create()
      const instance = axios.create({
              baseURL: `https://api.openweathermap.org/data/2.5/weather`,
              params: {...this.paramsTemp, lat, lon}
            });
      //resp.data
      const resp = await instance.get();
      const {weather, main} = resp.data

      return {
    
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      }
    

    } catch (error) {
      console.log(error)
    }
  }


  agregarHistorial(lugar =''){
    //prevenir duplicados
    if(this.historial.includes(lugar.toLocaleUpperCase())){
      return
    }


    this.historial.unshift(lugar.toLocaleUpperCase())

    //grabar en db
    this.guardarDB()


  }

  guardarDB() {

    const payload = {
      historial : this.historial
    }

    fs.writeFileSync(this.dbPath, JSON.stringify(payload))
  }

  leerDB() {
    if(!fs.existsSync(this.dbPath)) return

    const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})
    const data = JSON.parse(info)

    this.historial = data.historial
  }
}

module.exports = Busquedas;
