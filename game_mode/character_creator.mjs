import alt from 'alt';
import Database from './database';
import Inventory from './inventory';
import chat from 'chat';


let next_dimension = 1;

function moveOn(player, account_id, character_id, props) {
	//alt.log( JSON.stringify(props) );

	//real gameplay starts here
	Inventory.load(player, character_id);
}

function finalSpawn(player) {
	//player.spawn(0, 0, 72, 0);
	player.spawn(386.20220947265625, -1026.883544921875, 28.63151, 0);
	player.dimension = 0;
}

alt.on('playerDisconnect', (player) => {
	alt.emitClient(player, 'cleanUp');
});

alt.onClient('onConfirmCharacterCreation', async (player, account_id, properties) => {
	try {
		//adding new character to database
		let encoded_props = encodeURI(properties);
		let res = await Database.execQuery(`INSERT INTO ${Database.name}.characters VALUES
			(NULL, ${account_id}, '${encoded_props}')`);
		//alt.log('result:', JSON.stringify(res));
		if(res['affectedRows'] > 0) {
			let ch_res = await Database.getPlayerCharacters(account_id);
			if(ch_res < 1)
				throw new Error('No characters found after inserting one');
			let ch_id = ch_res[ch_res.length-1]['id'];

			alt.log('Player with id:', account_id, 'created new character with id:', ch_id,
				`[${encoded_props.length}]`);
			alt.emitClient(player, 'closeCharacterCreator', account_id, properties, ch_id);
		}
		else
			alt.logError('Could not insert new character into database');
	}
	catch(e) {
		alt.logError('MySQL error:', e);
	}
});

alt.onClient('onCharacterLoaded', (player, account_id, properties, character_id) => {
	alt.log('Character loaded for user:', account_id);
	finalSpawn(player);
	if(typeof properties === 'string')
		properties = JSON.parse(properties);
	moveOn(player, account_id, character_id, properties);
});

alt.onClient('onCharacterCreatorClosed', (player, account_id, properties, character_id) => {
	finalSpawn(player);
	if(typeof properties === 'string')
		properties = JSON.parse(properties);
	moveOn(player, account_id, character_id, properties);
});

//properties is a json string
alt.onClient('onCharacterChosen', (player, account_id, properties, character_id) => {
	alt.emitClient( player, 'loadCharacter', account_id, properties, character_id );
});

export default {
	async onLoginFinished(player, res) {
		alt.log('user logged in:', res['name'], res['id']);

		player.dimension = next_dimension++;

		try {
			await Database.onPlayerLogin(res['id'], res['name'], res['avatar']);

			let res2 = await Database.execQuery(`SELECT characters_slots 
				FROM ${Database.name}.players WHERE forum_id = ${res['id']};`);
			let slots = res2[0]['characters_slots'];//player slots for character

			let ch_res = await Database.getPlayerCharacters(res['id']);
			alt.log(`characters: ${ch_res.length}, slots: ${slots}`);
			if(slots == 1) {
				if(ch_res.length > 0) {//loads first and only character
					alt.emitClient( player, 'loadCharacter', res['id'], 
						decodeURI(ch_res[0]['appearance']), ch_res[0]['id'] );
				}
				else//create first character
					alt.emitClient(player, 'showCharacterCreator', res['id']);
			}
			else {//show character selector
				if(ch_res.length > 0)
					alt.emitClient(player, 'showCharacterSelector', res['id'], slots, ch_res);
				else
					alt.emitClient(player, 'showCharacterCreator', res['id']);
			}
		}
		catch(e) {
			alt.logError('MySQL error:', e);
		}
	}
}