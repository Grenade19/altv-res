import chat from 'chat';
import alt from 'alt';
import Database from '../database';

// =============================================================================
// Car Spawn
// =============================================================================

function createVehicle(player, model, x, y, z) {
	const veh = alt.createVehicle(model, x, y, z, 0, 0, 0);

	if (veh) {
		let newArr = player.getMeta('vehs').slice();
		newArr.push(veh);
		player.setMeta('vehs', newArr);

		/*setTimeout(() => {
			alt.emitClient(player, 'setintoveh', veh);
		}, 10);*/
	}
}

chat.registerCmd('veh', (player, args) => {
	if (!player.getMeta('vehs')) {
		player.setMeta('vehs', []);
	}

	let vehs = player.getMeta('vehs')

	if (vehs.length >= 2) {
		alt.removeEntity(vehs[0]);

		vehs.shift();
		player.setMeta('vehs', vehs);
	}

	if (args.length === 1) {
		let pos = player.pos;
		createVehicle(player, args[0], pos.x, pos.y + 1, pos.z);
	} else if (args.length === 4) {
		createVehicle(player, args[0], args[1], args[2], args[3]);
	} else {
		chat.send(player, '{FF0000}Usage: {FFFFFF}/veh [model]');
	}
});

// =============================================================================
// Player's Position Coords on chat
// =============================================================================

chat.registerCmd('pos', (player, args) => {
	let pos = player.pos
	chat.send(player, '{00FF00}Pozycja: { x: ' + pos.x + ', y: ' + pos.y + ', z: ' + pos.z + ' }')

	if (args.length === 1) {
		coords[args[0]] = { name: player.name, pos: { x: pos.x, y: pos.y, z: pos.z } }
	}
});


// ==============================================================================
// Id command
// ==============================================================================

chat.registerCmd('id', (player) => {

	chat.send(player, `{55FF55}ID: ${player.id}`);
});

// ==============================================================================
// RP
// ==============================================================================

chat.registerCmd('tweet', (player, args) => {

	let wiadomosc = args.join(" ");

	chat.send(null, `<div style="padding: 0.25vw; margin: 0.25vw; background-color: rgba(27, 149, 224, 0.67); border-radius: 3px;"> @${player.name} //</br>${wiadomosc}</img></div>`);
});

chat.registerCmd('dw', (player, args) => {

	let wiadomosc = args.join(" ");

	chat.send(null, `<div style="padding: 0.25vw; margin: 0.25vw; background-color: rgba(19, 18, 18, 0.67); border-radius: 3px;"><img src="data:image/png;base64,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" height="20"/> ANONIM </br>${wiadomosc}</img></div>`);
});

chat.registerCmd('ooc', (player, args) => {

	let wiadomosc = args.join(" ");

	chat.send(null, `<div style="padding: 0.25vw; margin: 0.25vw; background-color: rgba(124, 124, 124, 0.37); border-radius: 3px;"><img src="https://image.flaticon.com/icons/svg/149/149229.svg" height="16"> ${player.name} </br>${wiadomosc}</img></div>`);
});

