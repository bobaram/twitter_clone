# Twitter Clone

## Overview

This project is a Twitter clone application built with Express, Sequelize, and TypeScript. It includes features such as user authentication, tweet creation, and tagging functionality.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup Instructions](#setup-instructions)
3. [Database Setup](#database-setup)
4. [Running the Project](#running-the-project)
5. [Testing](#testing)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/) (or [yarn](https://yarnpkg.com/) if preferred)
- [MySQL](https://www.mysql.com/) (or a MySQL-compatible database)

## Setup Instructions

1. **Clone the Repository**

    ```bash
    git clone https://github.com/your-repository-url.git
    cd your-repository
    ```

2. **Install Dependencies**

    Install the required npm packages:

    ```bash
    npm install
    ```

3. **Configure Environment Variables**

    Create a `.env` file in the root directory of the project. You can use `.env.example` as a template. Update it with your database configuration and JWT secret:

    
    ```env
    #Development database
    
    DB_HOST_DEV=localhost
    DB_NAME_DEV= twitter_clone
    DB_USER_DEV=your_database_user
    DB_PASS_DEV=your_database_password
    
   #Test database
  
   DB_HOST_TEST=localhost
   DB_NAME_TEST=twitter_clone_test
   DB_USER_TEST=your_database_user
   DB_PASS_TEST=your_database_password
    
   JWT_SECRET=your_jwt_secret
   PORT=3000

  ```

## Database Setup

1. **Create Database**

    Ensure you have MySQL running
    and create a database for your project.
    You can  run database.sql and 
    database.test.sql files in MySQL Workbench 
    to create a dev and test database respectively. 


2. **Initialize db**

    ```bash
    npm run init-db
    ```

## Running the Project

1. **Start the Development Server**

    You can start the development server using:

    ```bash
    npm run start
    ```

    This will start the server with hot reloading.

## Testing

1. **Run Unit and Integration Tests**

    To execute unit and integration tests, use:

    ```bash
   - set NODE_ENV=test
 -   npm run test
    ```

    Ensure that your test environment 
    is properly configured.

2. **Run Specific Test Files**

    You can also run specific test files using:

    ```bash
    npx jest path/to/test/file
    ```



