CREATE DATABASE IF NOT EXISTS booktracker;
USE booktracker;
-- Authors table
CREATE TABLE authors(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
-- Books table with foreign key to authors
CREATE TABLE books(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    author_id INT,
    FOREIGN_KEY (author_id) REFERENCES authors(id)
);
-- Sample data
INSERT INTO authors (name) VALUES ('George Orwell'), ('J.K. Rowling');

INSERT INTO books (title, author_id, read)
VALUES ('1984', 1, false),
       ('Animal Farm', 1, true),
       ('Harry Potter and the Sorcerer''s Stone', 2, false);