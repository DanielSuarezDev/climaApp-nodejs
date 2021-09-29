require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  const busquedas = new Busquedas();

  let opt = "";

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        const termino = await leerInput("Ciudad: ");
        const lugares = await busquedas.ciudad(termino);
        const idSelect = await listarLugares(lugares)

        if(idSelect === '0')continue

        //guardar db
        
        const lugarSel = lugares.find( l => l.id === idSelect)
        busquedas.agregarHistorial(lugarSel.nombre)

        const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

        console.clear()
        console.log("Informacion de la ciudad".green);
        console.log("Ciudad", lugarSel.nombre);
        console.log("Lat", lugarSel.lat);
        console.log("Lng", lugarSel.lng);
        console.log("Temperatura", clima.temp);
        console.log("min", clima.min);
        console.log("max", clima.max);
        console.log("pronostico", clima.desc);

        break;

        case 2:

        busquedas.historial.forEach((lugar,i) => {
          const idx = `${i + 1}.`.green
          console.log(`${idx} ${lugar}`)
        })

        break

      default:
        break;
    }

    await pausa();
  } while (opt !== 0);
};

main();
