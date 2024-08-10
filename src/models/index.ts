import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

interface DbConfig {
    host: string;
    username: string;
    password: string;
    database: string;
    dialect: 'mysql';
}

function getDbConfig(): DbConfig {
    const env = process.env.NODE_ENV;

    if (env === 'test') {
        return {
            host: process.env.DB_HOST_TEST!,
            username: process.env.DB_USER_TEST!,
            password: process.env.DB_PASS_TEST!,
            database: process.env.DB_NAME_TEST!,
            dialect: 'mysql',
        };
    }

    return {
        host: process.env.DB_HOST_DEV!,
        username: process.env.DB_USER_DEV!,
        password: process.env.DB_PASS_DEV!,
        database: process.env.DB_NAME_DEV!,
        dialect: 'mysql',
    };
}

const config = getDbConfig();

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
});

export default sequelize;
