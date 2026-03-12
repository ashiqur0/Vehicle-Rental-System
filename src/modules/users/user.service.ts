import { pool } from "../../config/db";
import bcrypt from 'bcryptjs';

const getUsers = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    
    return result;
}

export const userServices = {
    getUsers,
}