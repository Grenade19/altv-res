CREATE TABLE IF NOT EXISTS {{DB_NAME}}.players (
	forum_id INT NOT NULL,
	nick VARCHAR(64) NOT NULL,
	characters_slots TINYINT NOT NULL DEFAULT 1,
	first_login_timestamp VARCHAR(16) NOT NULL,
	last_login_timestamp VARCHAR(16) NOT NULL,
	avatar VARCHAR(512) NULL,

	PRIMARY KEY (forum_id),
	UNIQUE INDEX (forum_id ASC)
);

CREATE TABLE IF NOT EXISTS {{DB_NAME}}.characters (
	id INT NOT NULL AUTO_INCREMENT,
	player_id INT NOT NULL,
	appearance VARCHAR(4096) NOT NULL,

	PRIMARY KEY (id),
	UNIQUE INDEX (id ASC),
	FOREIGN KEY (player_id) REFERENCES {{DB_NAME}}.players(forum_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS {{DB_NAME}}.categories (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE,

	PRIMARY KEY (id),
	UNIQUE INDEX (id ASC)
);

CREATE TABLE IF NOT EXISTS {{DB_NAME}}.items (
	id INT NOT NULL AUTO_INCREMENT,
	category_id INT NOT NULL DEFAULT 1,
	name VARCHAR(64) NOT NULL,
	usable TINYINT(1) DEFAULT 0,

	PRIMARY KEY (id),
	UNIQUE INDEX (id ASC),
	UNIQUE INDEX (name ASC),

	FOREIGN KEY (category_id) REFERENCES {{DB_NAME}}.categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS {{DB_NAME}}.belongings (
	item_id INT NOT NULL,
	character_id INT NOT NULL,
	amount INT NOT NULL,

	PRIMARY KEY (item_id, character_id),
	UNIQUE INDEX (item_id, character_id),

	FOREIGN KEY (item_id) REFERENCES {{DB_NAME}}.items(id) ON DELETE CASCADE,
	FOREIGN KEY (character_id) REFERENCES {{DB_NAME}}.characters(id) ON DELETE CASCADE
);