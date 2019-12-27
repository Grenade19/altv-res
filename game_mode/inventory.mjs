//@ts-check
import alt from 'alt';
import chat from 'chat';
import Database from './database';
import Items from './database/items.json';

function convertName(item_name) {
	if(item_name in Items)
		return Items[item_name][0];
	return item_name;
}

const pow = x => x*x;

class Inventory {
	constructor(_player, _character_id) {
		this.player = _player;
		this.character_id = _character_id;
		this.belongings = [];
	}

	getBelongings() {
		return this.belongings.filter(b => b.amount > 0);
	}

	giveItem(id, item_name, amount, category_name, usable = false) {
		let item = this.belongings.find(b => b.id === id);
		if(item) {
			item.amount += amount;
			alt.emitClient(this.player, 'onItemAmountUpdate', item.item_name, item.amount);
			return item;
		}
		
		//inserting new item
		let new_item = {id, item_name, amount, category_name, usable};
		this.belongings.push(new_item);
		//if(!usable)
		alt.emitClient(this.player, 'onItemGiven', item_name, amount);
		return new_item;
	}

	async tradeItem(target_inv, item, amount, update_database) {
		let current_item = this.belongings.find(b => b.id === item.id);
		if(!current_item) {
			alt.logError('Player\'s inventory does not contain an item to be given');
			return;
		}
		if(current_item.amount < amount) {
			alt.logError('Player does not have enough amount of item to give away');
			return;
		}

		//take from current player
		await this.changeItemAmount(current_item.id, current_item.amount - amount, update_database);

		let target_item = target_inv.belongings.find(b => b.id === item.id);
		
		if(target_item) {
			//give some to target player
			await target_inv.changeItemAmount(target_item.id, target_item.amount + amount, 
				update_database);
		}
		else {//give new item
			if(update_database) {
				await target_inv.insertItem(item.id, item.item_name, amount, item.category_name,
					item.usable);
			}
			else {
				await target_inv.giveItem(item.id, item.item_name, amount, item.category_name,
					item.usable);
			}
		}
		//chat.send(target_inv.player, `{8BC34A}Otrzymano przedmiot: ${item.item_name} (${amount})`);
		alt.emitClient(target_inv.player, 'showNotification', this.player.name, 
			`Otrzymano przedmiot: ${convertName(item.item_name)} (${amount})`);
	}

	async changeItemAmount(id, new_amount, update_database) {
		let item = this.belongings.find(b => b.id === id);
		if(!item) {
			alt.logError('Cannot remove item that does not exists in user\'s inventory');
			return;
		}

		item.amount = Math.max(0, new_amount);

		//if(!usable)
		alt.emitClient(this.player, 'onItemAmountUpdate', item.item_name, item.amount);

		if(update_database) {
			try {
				await Database.updateBelongingAmmount(id, this.character_id, item.amount);
			}
			catch(e) {
				alt.logError('Database error:', e);
			}
		}
	}

	async insertItem(id, item_name, amount, category_name, usable = false) {
		let item = this.giveItem(id, item_name, amount, category_name, usable);

		let current_ammount = await Database.getBelongingAmmount(id, this.character_id);
		if(current_ammount.length > 0)//update existsing row
			var res = await Database.updateBelongingAmmount(id, this.character_id, item.amount);
		else//insert new row into belongings
			var res = await Database.insertBelonging(id, this.character_id, item.amount);
		
		return res['affectedRows'] > 0;
	}
}

//@type {Inventory[]}
var inventories = {};//indexed by players ids

async function giveItem(player_id, item_name, amount) {
	let inv = inventories[player_id];
	if(!inv)
		return 3;

	//@type {{id: number, category_name: string, item_name: string, usable: number}[]}
	let item = [];
	if(item_name.replace(/\d*/g, '') === '')
		item = await Database.getItemById( parseInt(item_name) );
	else
		item = await Database.getItemByName( item_name.toUpperCase() );
	if(item.length < 1)
		return 2
	item = item[0];
	//alt.log( JSON.stringify(item) );
	let res = await inv.insertItem(item['id'], item['item_name'], amount, 
		item['category_name'], item['usable'] == 1);

	if(res === true)
		return 0;
	else
		return 1;
}

// /giveitem [PLAYER_ID] [ITEM_NAME] [AMOUNT]
chat.registerCmd('giveitem', async (player, args) => {
	if(args.length < 3)
		return chat.send(player, '{FF5555}Uzycie: /giveitem [PLAYER_ID] [ITEM_NAME / ID] [AMOUNT]');

	if(args[2].replace(/\d*/g, '') !== '')
		return chat.send(player, '{FF5555}Kwota musi być dodatnią liczbą całkowitą');

	let error_code = await giveItem(parseInt(args[0]), args[1], parseInt(args[2]));
	if(error_code === 0) {
		chat.send(player, '{55FF55}SUCCESS');
		return;
	}
	switch(error_code) {
		case 1:
			chat.send(player, '{FF5555}DATABASE ERROR');
			break;
		case 2:
			chat.send(player, `{FF5555}Nie ma takiego przedmiotu: ${args[1]}`);
			break;
		case 3:
			chat.send(player, '{FF5555}Nie istnieje żaden ekwipunek dla gracza')
			break;
		default:
			chat.send(player, '{FF5555}UNKNOWN ERROR');
			break;
	}
});

alt.on('playerDisconnect', (player) => {
	alt.log('Unloading inventory data for player:', player.id);
	inventories[parseInt(player.id)] = null;//cannot be removed cause array indexes must not change
});

alt.onClient('requestInventoryData', (player) => {
	let inv = inventories[parseInt(player.id)];
	if(!inv)
		alt.logError('No inventory found for player: ' + player.id);
	else
		alt.emitClient(player, 'inventoryDataUpdate', inv.getBelongings());
});

alt.onClient('removeFromInventory', async (player, item, amount) => {
	let inv = inventories[parseInt(player.id)];
	if(!inv) {
		alt.logError('No inventory found for player: ' + player.id);
		return;
	}
	
	//alt.log('removing:', JSON.stringify(item), amount);
	await inv.changeItemAmount(item.id, item.amount - amount, true);
	alt.emitClient(player, 'inventoryDataUpdate', inv.getBelongings());
});

alt.onClient('changeAmmoInInventory', async (player, item_name, amount) => {
	let inv = inventories[parseInt(player.id)];
	if(!inv) {
		alt.logError('No inventory found for player: ' + player.id);
		return;
	}
	let item = inv.getBelongings().find(b => b.item_name === item_name);
	if(item) {
		await inv.changeItemAmount(item.id, item.amount - amount, true);
		if(amount < 0)
			chat.send(player, `{8BC34A}Dodano przedmiot: ${convertName(item_name)} (${-amount})`);
		alt.emitClient(player, 'inventoryDataUpdate', inv.getBelongings());
	}
	else if(amount < 0) {//giving new item
		if(0 === await giveItem(player.id, item_name, -amount))
			chat.send(player, `{8BC34A}Otrzymano przedmiot: ${convertName(item_name)} (${-amount})`);
		else
			alt.log('Error why giving item to player (changeAmmoInInventory)');
		alt.emitClient(player, 'inventoryDataUpdate', inv.getBelongings());
	}
});

alt.onClient('confirmTrade', async (player, target_player_id, item, amount) => {
	let inv = inventories[parseInt(player.id)];
	let target_inv = inventories[target_player_id];

	if(!inv) {
		alt.logError('No inventory found for player: ' + player.id);
		return;
	}
	if(!target_inv) {
		alt.logError('No inventory found for player: ' + target_player_id, typeof target_player_id);
		return;
	}

	await inv.tradeItem(target_inv, item, amount, true);

	alt.emitClient(player, 'inventoryDataUpdate', inv.getBelongings());
	for(let p of alt.players) {
		if(p.id == target_player_id)
			alt.emitClient(p, 'inventoryDataUpdate', target_inv.getBelongings());
	}
});

alt.onClient('getNearbyPlayersForTrade', (player, item) => {
	const MAX_DISTANCE = 10;

	let nearby_players = [];
	for(let p of alt.players) {
		if(p.id !== player.id) {
			//check distance
			if(Math.sqrt(pow(player.pos.x - p.pos.x) + pow(player.pos.y - p.pos.y) + 
				pow(player.pos.z - p.pos.z)) <= MAX_DISTANCE)
			{
				nearby_players.push({id: p.id, nick: p.name});
			}
		}
	}
	alt.emitClient(player, 'returnNearbyPlayers', nearby_players, item);
});

alt.onClient('useInventoryItem', async (player, item) => {
	let inv = inventories[parseInt(player.id)];
	if(!inv) {
		alt.logError('No inventory found for player: ' + player.id);
		return;
	}
	if(item.amount <= 0) {
		alt.logError('Player does not have this item in inventory: ' + item.item_name);
		return;
	}
	await inv.changeItemAmount(item.id, item.amount-1, true);
	alt.emitClient(player, 'inventoryDataUpdate', inv.getBelongings());

	alt.log('TODO - using item:', item.item_name);

	switch(item.item_name) {
		default:
			alt.logError('Cannot use this item: ' + item.item_name);
			break;
		//case 'RP_BREAD':
			//TODO
			//break;
	}
});

export default {
	async load(player, character_id) {
		alt.log('Loading inventory for player:', player.id, 'and character: ', character_id);
		alt.emitClient(player, 'clearInventory');

		//selected attributes: item_id, amount, category_name, item_name, usable
		let items = await Database.getCharacterInventory(character_id);
		let inv = new Inventory(player, character_id);
		for(let row of items) {
			let amount = parseInt(row['amount']);
			if(amount <= 0)
				continue;
			inv.giveItem(row['item_id'], row['item_name'], amount, 
				row['category_name'], row['usable'] == 1);
		}
		inventories[parseInt(player.id)] = inv;
	}
}