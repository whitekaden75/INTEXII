-- Create the movies_titles table in MySQL
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

-- After exporting movies_titles.csv from SQLite, run this to import data:
-- (Make sure the CSV file is accessible to the MySQL server and LOCAL INFILE is enabled)

LOAD DATA LOCAL INFILE 'path/to/movies_titles.csv'
INTO TABLE movies_titles
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;