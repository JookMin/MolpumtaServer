DROP DATABASE IF EXISTS molpumta_db;
CREATE DATABASE molpumta_db;
USE molpumta_db;

CREATE TABLE user_info (
	id INT NOT NULL PRIMARY KEY,
	username VARCHAR(20),
	active BOOLEAN DEFAULT FALSE
);