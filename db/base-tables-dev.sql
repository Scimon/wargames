-- Expermental Node Table for Storing Hex data
DROP TABLE IF EXISTS wargames_dev.hexmap;
CREATE TABLE wargames_dev.hexmap (
	`id` INT(10) unsigned NOT NULL auto_increment,
	`name` VARCHAR(255) NOT NULL DEFAULT '',
	PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS wargames_dev.hextype;

DROP TABLE IF EXISTS wargames_dev.hex;
CREATE TABLE wargames_dev.hex (
	`map_id` INT(10) unsigned NOT NULL,
	`x` INT(10) NOT NULL DEFAULT 0,
	`y` INT(10) NOT NULL DEFAULT 0,
	`hextype` VARCHAR(255) NOT NULL DEFAULT '',
	PRIMARY KEY ( `map_id`, `x`, `y` )
);
