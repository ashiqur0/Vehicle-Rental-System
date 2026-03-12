import { pool } from "../../config/db";
import bcrypt from 'bcryptjs';

const createUser = async (payload: Record<string, string>) => {
    const { name, email, password, phone, role='customer' } = payload;

    if (password!.length < 6 || !email || !name || !phone) return null;

    const processedEmail = (email as string).toLowerCase();
    const hashedPassword = await bcrypt.hash(password as string, 10);

    const result = await pool.query(`
        INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, processedEmail, hashedPassword, phone, role]
    );

    return result;
}

export const userServices = {
    createUser,
}