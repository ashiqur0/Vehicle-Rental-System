import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
    connectionString: config.connection_string
});

const initDb = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password TEXT NOT NULL,
            phone VARCHAR(20) NOT NULL,
            role VARCHAR(20) DEFAULT 'customer'
            )
        `)
}

export default initDb;