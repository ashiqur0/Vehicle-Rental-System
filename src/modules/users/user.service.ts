import { pool } from "../../config/db";

const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role='customer' } = payload;
    const result = await pool.query(`
        INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, email, password, phone, role]
    );

    return result;
}

export const userServices = {
    createUser,
}