require('ts-node/register'); // Enable TypeScript support for migrations
require('dotenv').config()

const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'mysql',
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST,
        dialect: 'mysql',
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        ssl: {
            ca: fs.readFileSync(path.resolve(__dirname, 'certs', 'ca.pem')),
        },
    },
};

module.exports = config[env]; 