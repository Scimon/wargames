-- Mysql commands to create Dev Database
create database `wargames-dev`;
create user 'wargames'@'localhost' IDENTIFIED BY 'ed34CV%^';
GRANT ALL PRIVILEGES ON wargames.* TO 'wargames'@'localhost';