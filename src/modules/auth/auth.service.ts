import { pool } from "../../config/db";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from "../../config";

const signup = async (payload: Record<string, string>) => {
    const { name, email, password, phone, role = 'customer' } = payload;

    if (password!.length < 6 || !email || !name || !phone) return null;

    const processedEmail = (email as string).toLowerCase();
    const hashedPassword = await bcrypt.hash(password as string, 10);

    const result = await pool.query(`
        INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, processedEmail, hashedPassword, phone, role]
    );

    const user = result.rows[0];
    const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, config.jwt_secret as string, { expiresIn: '7d' });

    return { user, token };
}

const signin = async (payload: Record<string, string>) => {
    const { email, password } = payload;
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    const match = await bcrypt.compare(password!, user.password);
    if (!match) return null;

    const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, config.jwt_secret as string, { expiresIn: '7d' });

    return { user, token };
}

export const authServices = {
    signup,
    signin
}