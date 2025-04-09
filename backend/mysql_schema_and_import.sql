-- MySQL schema creation script based on your models
-- Adjust VARCHAR lengths as needed

CREATE DATABASE IF NOT EXISTS moviesdb;
USE moviesdb;

-- Table: movies
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    release_year INT,
    genre VARCHAR(255)
);

-- Table: movies_ratings
CREATE TABLE IF NOT EXISTS movies_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    user_id INT,
    rating FLOAT,
    review TEXT,
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- Table: movies_titles (based on Movie.cs)
CREATE TABLE IF NOT EXISTS movies_titles (
    show_id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(255),
    title VARCHAR(255),
    director VARCHAR(255),
    cast TEXT,
    country VARCHAR(255),
    release_year INT,
    rating VARCHAR(50),
    duration VARCHAR(50),
    description TEXT,
    genre VARCHAR(255)
);

-- Table: movies_users
CREATE TABLE IF NOT EXISTS movies_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    password_hash VARCHAR(255)
);

-- Import CSV data into each table
-- Adjust file paths accordingly and ensure LOCAL INFILE is enabled

LOAD DATA LOCAL INFILE '/path/to/movies.csv'
INTO TABLE movies
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE '/path/to/movies_ratings.csv'
INTO TABLE movies_ratings
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE '/path/to/movies_titles.csv'
INTO TABLE movies_titles
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE '/path/to/movies_users.csv'
INTO TABLE movies_users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;