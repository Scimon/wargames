-- Expermental Node Table for Storing Hex data
CREATE TABLE wargames_dev.hexmap (
	`id` INT(10) unsigned NOT NULL auto_increment,
	`name` VARCHAR(255),
	PRIMARY KEY (`id`)
);

CREATE TABLE wargames_dev.hextype(
	`id` INT(10) unsigned NOT NULL auto_increment,
	`name` VARCHAR(255),
	PRIMARY KEY (`id`)
);

CREATE TABLE wargames_dev.hex (
	`map_id` INT(10) unsigned NOT NULL,
	`x` INT(10) NOT NULL,
	`y` INT(10) NOT NULL,
	`hextype_id` INT(10) unsigned NOT NULL,
	PRIMAY KEY ( `map_id`, `x`, `y` )
);
