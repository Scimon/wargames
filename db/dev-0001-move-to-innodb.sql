ALTER TABLE wargames_dev.hexmap ENGINE = InnoDB;
ALTER TABLE wargames_dev.hex ENGINE = InnoDB;
ALTER TABLE wargames_dev.hex ADD FOREIGN KEY `hex_to_map` ( `map_id` ) REFERENCES `wargames_dev`.`hexmap` ( `id` ) ON DELETE CASCADE;