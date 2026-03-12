import { pool } from "../../config/db";

async function calculateTotalPrice(vehicle_id: number, rent_start_date: string, rent_end_date: string): Promise<number> {
    const vehicleResult = await pool.query(`SELECT daily_rent_price FROM vehicles WHERE id = $1`, [vehicle_id]);
    const daily_rent_price = vehicleResult.rows[0].daily_rent_price;

    // Calculate the number of days
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return daily_rent_price * diffDays;
}

const createBooking = async (payload: Record<string, unknown>) => {
    // rent_start_date format: YYYY-MM-DD for example: 2024-07-01
    // rent_end_date format: YYYY-MM-DD for example: 2024-07-05

    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    const total_price = await calculateTotalPrice(vehicle_id as number, rent_start_date as string, rent_end_date as string);
    
    const result = await pool.query(`
        INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price
    ]);
    
    return result.rows[0];
}

export const bookingServices = {
    createBooking,
}