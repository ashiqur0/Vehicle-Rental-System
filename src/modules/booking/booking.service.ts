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
    // date format: YYYY-MM-DD for example: 2026-03-01
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    // check if vehicle is available
    const vehicleResult = await pool.query(`SELECT availability_status FROM vehicles WHERE id = $1`, [vehicle_id]);
    if (vehicleResult.rowCount === 0) {
        return "Vehicle not found";
    }

    if (vehicleResult.rows[0].availability_status !== 'available') {
        return "Vehicle is not available";
    }

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

    if (result.rowCount) {
        const status = 'booked';
        await pool.query(`
            UPDATE vehicles SET availability_status = $1 WHERE id = $2
        `, [status, vehicle_id]);
    }

    return {
        updatedVehicle: {
            id: vehicle_id,
            availability_status: 'booked'
        },
        booking: result.rows[0]
    };
}

const getBookings = async () => {
    const result = await pool.query(`SELECT * FROM bookings`);
    return result.rows;
}

const updateBooking = async (bookingId: string, payload: Record<string, unknown>) => {
    const { rent_start_date, rent_end_date } = payload;

    const total_price = await calculateTotalPrice(
        parseInt(bookingId),
        rent_start_date as string,
        rent_end_date as string
    );

    const result = await pool.query(`
        UPDATE bookings
        SET rent_start_date = $1, rent_end_date = $2, total_price = $3
        WHERE id = $4
        RETURNING *
    `, [
        rent_start_date,
        rent_end_date,
        total_price,
        bookingId
    ]);

    return result.rows[0];
};

export const bookingServices = {
    createBooking,
    getBookings,
    updateBooking
}