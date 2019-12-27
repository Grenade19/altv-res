import alt from 'alt';
import game from 'natives';
import {isOpen} from 'chat';

const drop_anim = 'anim@narcotics@trash';
let inventoryView = null;
let is_open = false;
let ammunitions = new Map();
let shooting_weapon_hashes = [];

function updatePedAmmo(item_name) {
	const ped = game.playerPedId();
	ammunitions.set( item_name, game.getAmmoInPedWeapon(ped, game.getHashKey(item_name)) );
}

function synchronizeAmmo(force = false) {
	const ped = game.playerPedId();
	for(let [item_name, ammo] of ammunitions.entries()) {
		let hash = game.getHashKey(item_name);
  		let curr_ammo = game.getAmmoInPedWeapon(ped, hash) || 0;
  		
  		if( curr_ammo </*!==*/ ammo && (game.getSelectedPedWeapon(ped) != hash || force) ) {
  			//alt.log(shooting_weapon_hashes, hash);
  			//let shooting_weapon_id = shooting_weapon_hashes.indexOf(hash);
  			//if(shooting_weapon_id !== -1) {
	  			//alt.log('Ammo changed for', item_name, curr_ammo, ammo);
  			alt.emitServer('changeAmmoInInventory', item_name, ammo - curr_ammo);
  			ammunitions.set(item_name, curr_ammo);

	  			//shooting_weapon_hashes.splice(shooting_weapon_id, 1);
	  		//}
  		}
	}
}

alt.setInterval(synchronizeAmmo, 1000);//check each second

/*alt.on('update', () => {
	const ped = game.playerPedId();
	if(game.isPedShooting(ped)) {
		let [bool, hash] = game.getCurrentPedWeapon(ped, 1, false);
		alt.log(hash, );
		/*shooting_weapon = {
			hash, 
			ammo: game.getAmmoInPedWeapon(ped, hash)
		};*
		shooting_weapon_hashes.push(hash);
	}
	/*else if(shooting_weapon !== null) {
		let new_ammo = game.getAmmoInPedWeapon(ped, shooting_weapon.hash);
		alt.log('fired:', shooting_weapon.ammo - new_ammo);

		shooting_weapon = null;
	}*
});*/

function switchDisplay() {
	if(!is_open && isOpen())//if chat is open
		return;//inventory cannot be opened
	is_open = !is_open;

    if(!inventoryView) loadHTML();
    inventoryView.emit('toogle_inventory_display', is_open);
    if(is_open) {
    	synchronizeAmmo(true);
    	alt.showCursor(true);
    	inventoryView.focus();
    	alt.toggleGameControls(false);
    	alt.emitServer('requestInventoryData');
    }
    else {
    	alt.showCursor(false);
    	inventoryView.unfocus();
    	alt.toggleGameControls(true);
    }
}

alt.on('keydown', (key) => {
    if(key === 'I'.charCodeAt(0))
    	switchDisplay();
});

function findOffset() {
	const ped = game.playerPedId();
	if( game.isPedWalking(ped) )
		return [0.6, 4.7, -0.1];
	else if( game.isPedSprinting(ped) )
		return [0.6, 5.7, -0.1];
	else if( game.isPedRunning(ped) )
		return [0.6, 4.7, -0.1];
	else
		return [0.4, 4.7, -0.1];
}

function dropAnimation() {
	game.requestAnimDict(drop_anim);

	function checkLoaded() {
		if(game.hasAnimDictLoaded(drop_anim)) {
			game.taskPlayAnim(game.playerPedId(), drop_anim, 'drop_front', 
				1.0, 0.0, 3, 0, 0, 0, 0, 0);
		}
		else
			alt.setTimeout(checkLoaded, 400);
	}
	checkLoaded();
}

function loadHTML() {
	inventoryView = new alt.WebView('http://resources/game_mode/inventory_html/index.html');

	//inventoryView.on('viewLoaded', () => alt.log('inventory html loaded'));

	inventoryView.on('onInventoryClose', () => {
		switchDisplay();
	});

	inventoryView.on('onInventoryItemRemove', (item, amount) => {
		if(item.item_name.startsWith('WEAPON')) {
			//alt.log('Dropping weapon', item.item_name, amount);
			const ped = game.playerPedId();
			const hash = game.getHashKey(item.item_name);
			//game.setPedDropsInventoryWeapon(ped, hash, ...findOffset(), amount);
			if(item.amount - amount <= 0) {
				alt.log('removing weapon', item.item_name);

				ammunitions.set(item.item_name, 0);
				ammunitions.delete(item.item_name);
				//game.giveWeaponToPed(ped, hash, 0, false, false);
				game.setPedAmmo(ped, hash, 0);
				alt.nextTick(() => game.removeWeaponFromPed(game.playerPedId(), hash));
	
				//dropAnimation();
			}
		}
		alt.emitServer('removeFromInventory', item, amount);
	});

	inventoryView.on('requestItemUse', (item) => {
		alt.emitServer('useInventoryItem', item);
	});

	inventoryView.on('requestTrade', (item) => {
		alt.emitServer('getNearbyPlayersForTrade', item);
		alt.showCursor(true);
	});

	inventoryView.on('onTradeConfirm', (player_id, item, amount) => {
		alt.emitServer('confirmTrade', player_id, item, amount);
	});
}

alt.onServer('returnNearbyPlayers', (nearby_players, item) => {
	if(!inventoryView) loadHTML();
	//alt.log('test', nearby_players, nearby_players.length);
	inventoryView.emit('openTrade', nearby_players, item);
});

alt.onServer('clearInventory', () => {
	loadHTML();//preload html
	game.requestAnimDict(drop_anim);//preload animation

	const ped = game.playerPedId();
	game.removeAllPedWeapons(ped, false);

	alt.setTimeout(() => {
		//alt.log('Is player switching in progress:', game.isPlayerSwitchInProgress());
		if (game.isPlayerSwitchInProgress()) {
			game.stopPlayerSwitch();
			//game.switchInPlayer( game.playerPedId() );
			game.renderFirstPersonCam(true, 0.0, 1);
			alt.toggleGameControls(true);

			game.displayHud(true);
		    game.displayRadar(true);
		}
	}, 2000);
});

alt.onServer('inventoryDataUpdate', (belongings) => {
	// alt.log(JSON.stringify(belongings));
	if(!inventoryView) loadHTML();
	inventoryView.emit('loadItems', belongings);
});

alt.onServer('onItemGiven', (item_name, amount) => {
	if(item_name.startsWith('WEAPON')) {
		if(amount > 0) {
			const ped = game.playerPedId();
			game.giveWeaponToPed(ped, game.getHashKey(item_name), amount, false, false);

			updatePedAmmo(item_name);
		}
	}
});

alt.onServer('onItemAmountUpdate', (item_name, amount) => {
	if(item_name.startsWith('WEAPON')) {
		const ped = game.playerPedId();
		const hash = game.getHashKey(item_name);
		if(amount > 0) {
			//if( game.hasPedGotWeapon(ped, hash, false) )//does not work, always returns false
				//game.setPedAmmo(ped, hash, amount);
			//else
			game.giveWeaponToPed(ped, hash, amount, false, false);
			game.setPedAmmo(ped, hash, amount);
			//alt.log('on ammo update', amount, 
			//	game.getAmmoInPedWeapon(ped, game.getHashKey(item_name)));
			updatePedAmmo(item_name);
		}
		else {
			ammunitions.set(item_name, 0);
			ammunitions.delete(item_name);
			game.removeWeaponFromPed(ped, hash);
		}
	}
});

alt.onServer('showNotification', (title, content) => {
	game.setNotificationTextEntry('CELL_EMAIL_BCON');
	//game.addTextComponentSubstringPlayerName(content);
	for(let i=0; i<content.length; i += 45) {
        game.addTextComponentSubstringPlayerName(
        	content.substr(i, Math.min(45, content.length - i))
        );
	}

	game.setNotificationMessage2('CHAR_MULTIPLAYER', 'CHAR_MULTIPLAYER', false, 1, title);
	game.drawNotification(false, true); 
});