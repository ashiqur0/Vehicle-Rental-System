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
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            registration_number VARCHAR(50) NOT NULL UNIQUE,
            daily_rent_price NUMERIC(10, 2) NOT NULL,
            availability_status VARCHAR(20) DEFAULT 'available'
        )
    `);
}

export default initDb;