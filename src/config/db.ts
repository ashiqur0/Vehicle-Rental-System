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
            role VARCHAR(20)
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

    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price NUMERIC(10, 2) NOT NULL,
            status VARCHAR(20) DEFAULT 'active'           
        )
    `);
}

export default initDb;