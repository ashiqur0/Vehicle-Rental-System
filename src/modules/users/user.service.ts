import { pool } from "../../config/db";

const getUsers = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    
    return result;
}

const updateUser = async (payload: Record<string, unknown>, userId: string) => {
    const { name, email, phone, role } = payload;
    const result = await pool.query(`
        UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *`, 
        [name, email, phone, role, userId]
    );
    return result;
}

export const userServices = {
    getUsers,
    updateUser
}