CREATE TABLE users (
id_number SERIAL PRIMARY KEY,
id_name CHAR(64) UNIQUE NOT NULL,
password CHAR(64) NOT NULL,
user_name CHAR(64) UNIQUE NOT NULL
);
CREATE TABLE rooms (
room_number SERIAL PRIMARY KEY,
room_id CHAR(64) UNIQUE NOT NULL,
password CHAR(64) NOT NULL
);
CREATE TABLE comments (
comment_number SERIAL PRIMARY KEY,
comment TEXT NOT NULL,
date DATE NOT NULL,
id_number INTEGER NOT NULL,
room_number INTEGER NOT NULL
);
CREATE TABLE menber_info (
menber_number SERIAL PRIMARY KEY,
id_number INTEGER NOT NULL,
room_number INTEGER NOT NULL
);
