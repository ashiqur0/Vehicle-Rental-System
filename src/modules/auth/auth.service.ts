import { pool } from "../../config/db";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from "../../config";

const signup = async (payload: Record<string, string>) => {
    const { name, email, password, phone } = payload;

    if (password!.length < 6 || !email || !name || !phone) return null;

    const processedEmail = (email as string).toLowerCase();
    const hashedPassword = await bcrypt.hash(password as string, 10);

    const result = await pool.query(`
        INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING *`, [name, processedEmail, hashedPassword, phone]
    );

    const user = result.rows[0];
    const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, config.jwt_secret as string, { expiresIn: '7d' });

    return { user, token };
}

const signin = async (email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    console.log({ match, password, password2: user.password, email, email2: user.email })
    if (!match) return false;

    const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, config.jwt_secret as string, { expiresIn: '7d' });

    return { user, token };
}

export const authServices = {
    signup,
    signin
}