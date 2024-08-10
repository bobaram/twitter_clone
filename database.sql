-- Create the database
CREATE DATABASE twitter_clone;

-- Use the created database
USE twitter_clone;

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the tweets table
CREATE TABLE tweets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    content VARCHAR(280) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create the tags table
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tweetId INT NOT NULL,
    userId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tweetId) REFERENCES tweets(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Optional: Create indexes to optimize query performance
CREATE INDEX idx_tweet_userId ON tweets(userId);
CREATE INDEX idx_tags_tweetId ON tags(tweetId);
CREATE INDEX idx_tags_userId ON tags(userId);
