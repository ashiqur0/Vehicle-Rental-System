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

const updateUserByThemselves = async (payload: Record<string, unknown>, userId: string) => {
    const { name, email, phone } = payload;
    const result = await pool.query(`
        UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *`, 
        [name, email, phone, userId]
    );
    return result;
}


const deleteUser = async (userId: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);

    return result;
}

export const userServices = {
    getUsers,
    updateUser,
    updateUserByThemselves,
    deleteUser
}