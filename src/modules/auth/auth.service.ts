import { pool } from "../../config/db";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from "../../config";

const signup = async (payload: Record<string, string>) => {
    const { name, email, password, phone, role = "customer" } = payload;

    if (password!.length < 6 || !email || !name || !phone) return null;
    if (email !== email.toLowerCase()) return null;
    const hashedPassword = await bcrypt.hash(password as string, 10);

    const result = await pool.query(`
        INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, email, hashedPassword, phone, role]
    );

    return result;
}

const signin = async (email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return false;

    const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, config.jwt_secret as string, { expiresIn: '3h' });

    return { token };
}

export const authServices = {
    signup,
    signin
}