-- data.sql

DROP DATABASE IF EXISTS users_books;

CREATE DATABASE  users_books;

\c users_books;

DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  username text NOT NULL,
  password text NOT NULL
);

CREATE TABLE favorites
(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  book_id text
);

CREATE TABLE reviewsList
(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  book_id text,
  rating INTEGER,
  content TEXT
);
