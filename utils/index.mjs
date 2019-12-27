import alt from 'alt';
import chat from 'chat';
import * as fs from 'fs';
import { resolve, dirname } from 'path';

alt.on('playerConnect', (player) => {
  player.spawn(0, 0, 72, 0);
});

const __dirname = dirname(decodeURI(new URL(import.meta.url).pathname)).replace(/^\/([A-Z]):\//, '$1:/');

const coordsFile = resolve(__dirname, 'coords.json');
let coords = JSON.parse(fs.readFileSync(coordsFile));

let currentWeather = 0;

function getCurrentIngameTime() {
  const realTime = Date.now();
  const timeFromDayBegin = realTime % (24 * 60 * 60 * 1000);
  let ingameTime = (timeFromDayBegin * 30) % (24 * 60 * 60 * 1000);
  const hours = Math.floor(ingameTime / (60 * 60 * 1000));
  ingameTime -= (hours * (60 * 60 * 1000));
  const minutes = Math.floor(ingameTime / (60 * 1000));
  ingameTime -= (minutes * (60 * 1000));
  const seconds = Math.floor(ingameTime / 1000);
  return {
    day: 1,
    month: 1,
    year: 2018,
    hours,
    minutes,
    seconds
  }
}

alt.on('playerConnect', (player) => {
  const ingameDT = getCurrentIngameTime();
  player.setDateTime(ingameDT.day, ingameDT.month, ingameDT.year, ingameDT.hours, ingameDT.minutes, ingameDT.seconds);
  player.setWeather(currentWeather);
});

chat.registerCmd('tp', (player, args) => {
  if (args.length === 1)  {
    let players = alt.getPlayersByName(args[0])

    if (players.length > 1) {
      chat.send(player, '{FF0000}Wiecej niż jeden gracz o nicku {00FF00}' + args[0] + ' {FF0000}wystepuje na serwerze')
      return
    }

    if (players.length === 1) {
      if (player == players[0]) {
        chat.send(player, '{00FF00}Dlaczego?')
      } else {
        let pos = players[0].pos
        player.pos = pos
      }

      return
    }
    
    if (players.length === 0) {
      let point = coords[args[0]]

      if (point) {
        player.pos = point.pos
      } else {
        chat.send(player, '{FF0000}Nie mozna znalezc takiej nazwy {00FF00}' + args[0])
      }

      return
    }
  } else if (args.length === 3) {
    player.pos = {
      x: Number.parseFloat(args[0]),
      y: Number.parseFloat(args[1]),
      z: Number.parseFloat(args[2])
    }
  } else {
    chat.send(player, '{FF0000}Uzycie: {FFFFFF}/tp [name] {00FF00}albo {FFFFFF}/tp [x] [y] [z]')
  }
});

chat.registerCmd('pos', (player, args) => {
  let pos = player.pos
  chat.send(player, '{00FF00}Pos: { x: ' + pos.x + ', y: ' + pos.y + ', z: ' + pos.z + ' }')

  if (args.length === 1) {
    coords[args[0]] = { name: player.name, pos: { x: pos.x, y: pos.y, z: pos.z } }

    fs.writeFileSync(coordsFile, JSON.stringify(coords, null, 4))
  }
});

chat.registerCmd('cp', (player, args) => {
  let pos;
    
  if (player.vehicle != null) {
    pos = player.vehicle.pos
    pos.z -= 0.5
  } else {
    pos = player.pos
    pos.z -= 1.1
  }

  player.createCheckpoint(45, pos.x, pos.y, pos.z, 3, 2.5, 255, 0, 0, 255)

  if (args.length === 1) {
    coords[args[0]] = { name: player.name, pos: { x: pos.x, y: pos.y, z: pos.z } }

    fs.writeFileSync(coordsFile, JSON.stringify(coords, null, 4))
  }
});

chat.registerCmd('weather', (player, args) => {
  //if (player.getMeta('admin')) {
    let weather = Number.parseInt(args[0]);

    if (weather < 0 || weather > 14)
      weather = 0;
  
    currentWeather = weather;
  
    for (let p of alt.players) {
      p.setWeather(currentWeather);
    }
});

/*chat.registerCmd('skin', (player, args) => {
  alt.emitClient(player, 'changeskin', Number.parseInt(args[0]));
});*/

chat.registerCmd('loadipl', (player, args) => {
  alt.emitClient(player, 'ipl', true, args[0]);
});

chat.registerCmd('unloadipl', (player, args) => {
  alt.emitClient(player, 'ipl', false, args[0]);
});

chat.registerCmd('players', (player, args) => {
  chat.send(player, `{00FF00}Players online: {00FFFF}${alt.players.length}`)
});

chat.registerCmd('playernames', (player, args) => {
  chat.send(player, `{00FF00}Players online:`);

  for (let p of alt.players) {
    chat.send(player, `  {00FFFF}${p.name}`);
  }
});

let fixCar = alt.createCheckpoint(45, -962, -3033, 12.8, 10, 1, 255, 0, 255, 255)
let fixCarBlip = alt.createBlipForCoords(4, -962, -3033, 12.8)

alt.on("entityEnterCheckpoint", (cp, entity) => {
  if (cp == fixCar && entity instanceof alt.Vehicle) {
    if (entity.driver) {
      alt.emitClient(entity.driver, 'fixCar')
    }
  }
});

alt.on("entityEnterCheckpoint", (cp, entity) => {
  if (cp == fixCar) {
    alt.log("Enter checkpoint");
  }
});

alt.on("entityLeaveCheckpoint", (cp, entity) => {
  if (cp == fixCar) {
    alt.log("Leave checkpoint");
  }
});
