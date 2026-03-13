import { pool } from "../../config/db";

// helper function
const systemAutoUpdateStatus = async () => {
    const result = await pool.query(`
        UPDATE bookings
        SET status = 'returned'
        WHERE status = 'active'
          AND rent_end_date < CURRENT_DATE
        RETURNING vehicle_id
    `);

    if (result.rowCount) {
        const vehicleIds = [...new Set(result.rows.map((row) => row.vehicle_id))];
        await pool.query(`
            UPDATE vehicles
            SET availability_status = 'available'
            WHERE id = ANY($1::int[])
        `, [vehicleIds]);
    }
};

// helper function
const calculateTotalPrice = async (vehicle_id: number, rent_start_date: string, rent_end_date: string): Promise<number> => {
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
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    // check if vehicle is available
    const vehicleResult = await pool.query(`SELECT availability_status, vehicle_name, daily_rent_price, type FROM vehicles WHERE id = $1`, [vehicle_id]);
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

    const bookevVehicle = result.rows[0];

    return {
        ...bookevVehicle,
        vehicle: {
            vehicle_name: vehicleResult.rows[0].vehicle_name,
            daily_rent_price: vehicleResult.rows[0].daily_rent_price
        },
    };
}

const getBookings = async () => {
    await systemAutoUpdateStatus();

    const result = await pool.query(`SELECT * FROM bookings`);

    return result.rows;
}

const getBookingByOwner = async (userEmail: string) => {
    await systemAutoUpdateStatus();

    const result = await pool.query(`
        SELECT b.* FROM bookings b
        JOIN users u ON b.customer_id = u.id
        WHERE u.email = $1`, [userEmail]);

    return result.rows;
}

const updateBookingByAdmin = async (bookingId: string) => {
    const result = await pool.query(`
        UPDATE vehicles SET availability_status = 'available' 
        WHERE id IN (
            SELECT vehicle_id FROM bookings WHERE status = 'returned' OR status = 'cancelled' AND id = $1
        )
    `, [bookingId]);

    return result.rowCount ? "Bookings updated successfully" : "No bookings to update";
};

const updateBookingByUser = async (bookingId: string) => {

    const currentDate = new Date().getTime();
    const previousBooking = await pool.query(`SELECT rent_start_date FROM bookings WHERE id = $1`, [bookingId]);
    const previousBookingDate = new Date(previousBooking.rows[0].rent_start_date).getTime();

    if (currentDate >= previousBookingDate) {
        return "Cannot update booking to an earlier date";
    }

    // change booking status to: cancelled
    const result = await pool.query(`
        UPDATE bookings
        SET status = 'cancelled'
        WHERE id = $1
        RETURNING *
    `, [bookingId]);

    // update vehicle availability
    if (result.rowCount) {
        const vehicle_id = result.rows[0].vehicle_id;
        await pool.query(`
            UPDATE vehicles SET availability_status = 'available' WHERE id = $1
        `, [vehicle_id]);
    }

    return "Your booking has been cancelled successfully";
};

export const bookingServices = {
    createBooking,
    getBookings,
    getBookingByOwner,
    updateBookingByAdmin,
    updateBookingByUser
}