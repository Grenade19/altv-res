//@ts-check
import alt from 'alt';
import mysql from 'mysql';
import * as fs from 'fs';
import { resolve, dirname } from 'path';
const __dirname = dirname(decodeURI(new URL(import.meta.url).pathname))
	.replace(/^\/([A-Z]):\//, '$1:/');

const DB_NAME = '';
const connection_config = {
	host:		'',
	user: 		'',
	password: 	'',
	database: 	DB_NAME
};

function connect() {
	return new Promise((resolve, reject) => {
		const connection = mysql.createConnection(connection_config);
		connection.connect((err) => {
			if(err)
				reject(err);
			else
				resolve(connection);
		});
	});
};

function exec(connection, query) {
	return new Promise((resolve, reject) => {
		connection.query(query, function(error, result) {
	 		if (error) 
	 			reject(error);
	 		else
	 			resolve(result);
		});
	});
}

let locked = false;

function waitForUnlock() {
	let tick = function(cb) {
		if(locked)
			setTimeout(() => tick(cb), 100);
		else
			cb();
	}

	return new Promise((resolve, reject) => {
		if(!locked)
			resolve();
		else
			tick(resolve);
	});
}

const Database = {
	name: DB_NAME,
	initialized: false,

	//NOTE - callback is optional but promise does not always work across altV modules
	async execQuery(query, callback = undefined) {
		try {
			if(locked)
				await waitForUnlock();
			locked = true;

			let connection = await connect();
			let result = await exec(connection, query);
			connection.end();
			locked = false;

			if(typeof callback === 'function')
				callback(result);
			return result;
		}
		catch(e) {
			if(typeof callback === 'function')
				callback(e);
			return e;
		}
	},

	async initTables() {
		if(Database.initialized)
			return;

		let sql_code = fs.readFileSync( resolve(__dirname, 'tables.sql'), 'utf8' )
			.replace(/{{DB_NAME}}/g, DB_NAME);
		
		let tables_code = sql_code.split(';');
		for(let table of tables_code) {
			if(table.length < 1)
				continue;
			try {
				await Database.execQuery(table);
			}
			catch(e) {alt.log(e)};
		}

		alt.log('Database structure initialized');
		Database.initialized = true;
	},

	/***** COMMON QUERIES *****/
	async onPlayerLogin(forum_id, nick, avatar) {
		let does_exists = await Database.execQuery(`SELECT nick FROM ${DB_NAME}.players 
			WHERE forum_id = ${forum_id}`);
		
		let now = Date.now().toString();
		if(!Array.isArray(does_exists) || does_exists.length < 1) {
			//adding new player to database
			alt.log('new user logged in:', nick);
			let insert_res = await Database.execQuery(`INSERT INTO ${DB_NAME}.players 
				VALUES(${forum_id}, '${nick}', 1, '${now}', '${now}', '${avatar}')`);
		}
		else {//updating player data
			let update_res = await Database.execQuery(`UPDATE ${DB_NAME}.players 
				SET avatar='${avatar}', last_login_timestamp='${now}' WHERE forum_id=${forum_id};`);
		}
	},

	getPlayerCharacters(player_id, callback) {//player_id a.k.a forum_id
		return Database.execQuery(`SELECT id, appearance FROM ${DB_NAME}.characters 
			WHERE player_id = ${player_id} LIMIT 128;`, callback);
	},

	getCharacterInventory(character_id) {
		return Database.execQuery(`SELECT item_id, amount, categories.name as category_name, 
				items.name as item_name, usable 
			FROM ${DB_NAME}.belongings 
				INNER JOIN ${DB_NAME}.items ON items.id = belongings.item_id 
				INNER JOIN ${DB_NAME}.categories ON categories.id = items.category_id 
			WHERE character_id = ${character_id} LIMIT 4096;`);
	},

	getItemByName(item_name) {//no need to protect from sql injection since it is server side code
		return Database.execQuery(`SELECT items.id, categories.name as category_name, 
				items.name as item_name, usable 
			FROM ${DB_NAME}.items INNER JOIN ${DB_NAME}.categories ON categories.id = category_id 
			WHERE items.name = '${item_name}' LIMIT 1;`);
	},

	getItemById(item_id) {//no need to protect from sql injection since it is server side code
		return Database.execQuery(`SELECT items.id, categories.name as category_name, 
				items.name as item_name, usable 
			FROM ${DB_NAME}.items INNER JOIN ${DB_NAME}.categories ON categories.id = category_id 
			WHERE items.id = ${item_id} LIMIT 1;`);
	},

	getBelongingAmmount(item_id, character_id) {
		return Database.execQuery(`SELECT amount FROM ${DB_NAME}.belongings
			WHERE item_id = ${item_id} AND character_id = ${character_id};`);
	},

	updateBelongingAmmount(item_id, character_id, new_amount) {
		return Database.execQuery(`UPDATE ${DB_NAME}.belongings SET amount = ${new_amount}
			WHERE item_id = ${item_id} AND character_id = ${character_id};`);
	},

	insertBelonging(item_id, character_id, amount) {
		return Database.execQuery(`INSERT INTO ${DB_NAME}.belongings 
			VALUES(${item_id}, ${character_id}, ${amount});`);
	}
};
export default Database;

setTimeout(() => {
	Database.initTables();
}, 1);