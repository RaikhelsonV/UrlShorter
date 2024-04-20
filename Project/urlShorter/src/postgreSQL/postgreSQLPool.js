import DatabaseError from "../error/DataBaseError.js";
import path from 'path';
import fs from 'fs';
import pkg from 'pg';
import dotenv from "dotenv";
import appLogger from "appLogger";

const log = appLogger.getLogger('postgreSQLPool.js');
dotenv.config();
const {Pool} = pkg;
const __dirname = path.resolve();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function createTable() {
    const client = await pool.connect();
    try {
        const sqlFilePath = path.join(__dirname, 'postgreSQL/createTable.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf-8');
        const queryResult = await client.query(sql);
        log.info('Tables created successfully');
    } catch (err) {
        log.error('Error creating table:', err);
        throw new DatabaseError('Failed to create table');
    } finally {
        client.release();
    }
}

createTable();

export {pool};
