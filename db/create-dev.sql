-- Mysql commands to create Dev Database
create database `wargames_dev`;
create user 'wargames'@'localhost' IDENTIFIED BY 'ed34CV%^';
GRANT ALL PRIVILEGES ON wargames_dev.* TO 'wargames'@'localhost';
