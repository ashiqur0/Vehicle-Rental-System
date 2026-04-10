import { pool } from "../../config/db";

const getUsers = async () => {
    const result = await pool.query(`SELECT * FROM users`);

    return result;
}

const getUserById = async (userId: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
    return result.rows[0];
};

const updateUserByAdmin = async (payload: Record<string, unknown>, userId: string) => {
    const { name, email, phone, role } = payload;
    const result = await pool.query(`
        UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *`,
        [name, email, phone, role, userId]
    );
    return {
        id: result?.rows[0]?.id,
        name: result?.rows[0]?.name,
        email: result?.rows[0]?.email,
        phone: result?.rows[0]?.phone,
        role: result?.rows[0]?.role
    };
}

const updateUserByOwner = async (payload: Record<string, unknown>, userId: string) => {
    const { name, email, phone } = payload;
    const result = await pool.query(`
        UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *`,
        [name, email, phone, userId]
    );

    if (result.rowCount === 0) {
        return null;
    }

    return {
        id: result?.rows[0]?.id,
        name: result?.rows[0]?.name,
        email: result?.rows[0]?.email,
        phone: result?.rows[0]?.phone,
        role: result?.rows[0]?.role
    };
}


const deleteUser = async (userId: string) => {
    const result = await pool.query(`
        DELETE FROM users
        WHERE id = $1
        AND NOT EXISTS (
            SELECT 1 
            FROM bookings 
            WHERE customer_id = $1 
            AND status = 'active'
        )
        RETURNING *;`, [userId]);

    const processedResult = {
        id: result?.rows[0]?.id,
        name: result?.rows[0]?.name,
        email: result?.rows[0]?.email,
        phone: result?.rows[0]?.phone,
        role: result?.rows[0]?.role
    }

    return processedResult;
}

export const userServices = {
    getUsers,
    getUserById,
    updateUserByAdmin,
    updateUserByOwner,
    deleteUser
}