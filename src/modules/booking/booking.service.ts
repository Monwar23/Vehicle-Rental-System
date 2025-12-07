
import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload

    const vehicleInfo = await pool.query(`SELECT daily_rent_price, availability_status FROM vehicles WHERE id = $1`, [vehicle_id]);
    if (vehicleInfo.rows.length === 0) {
        throw new Error("Vehicle not found");
    }
    const vehicle = vehicleInfo.rows[0];

    const startDate = new Date(rent_start_date as string);
    const endDate = new Date(rent_end_date as string);
    const number_of_days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (number_of_days <= 0) throw new Error("Invalid rent period");

    const total_price = vehicle.daily_rent_price * number_of_days;

    if (vehicle.availability_status !== "available") throw new Error("Vehicle not available");

    const result = await pool.query(`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
         VALUES($1, $2, $3, $4, $5, 'active') RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]);
    const insertedBooking = result.rows[0];
    await pool.query(`UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`, [vehicle_id]);

    const fullData = await pool.query(
        `SELECT 
        b.*, 
        v.vehicle_name, 
        v.daily_rent_price
     FROM bookings b
     JOIN vehicles v ON b.vehicle_id = v.id
     WHERE b.id = $1`,
        [insertedBooking.id]
    );

    const row = fullData.rows[0];

    fullData.rows[0] = {
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        vehicle: {
            vehicle_name: row.vehicle_name,
            daily_rent_price: row.daily_rent_price
        }
    };

    return fullData;

}

const getBooking = async (user: Record<string, unknown>) => {
    if (user.role === "admin") {
        const result = await pool.query(
            `
            SELECT 
                b.*,
                u.name AS customer_name,
                u.email AS customer_email,
                v.vehicle_name,
                v.registration_number
            FROM bookings b
            JOIN users u ON u.id = b.customer_id
            JOIN vehicles v ON v.id = b.vehicle_id
            ORDER BY b.id DESC;
            `
        );

        const data = result.rows.map(b => ({
            id: b.id,
            customer_id: b.customer_id,
            vehicle_id: b.vehicle_id,
            rent_start_date: b.rent_start_date,
            rent_end_date: b.rent_end_date,
            total_price: b.total_price,
            status: b.status,
            customer: {
                name: b.customer_name,
                email: b.customer_email
            },
            vehicle: {
                vehicle_name: b.vehicle_name,
                registration_number: b.registration_number
            }
        }));
        return {
            success: true,
            message: "Bookings retrieved successfully",
            data
        };
    }

    const result = await pool.query(
        `
        SELECT 
            b.*,
            v.vehicle_name,
            v.registration_number,
            v.type
        FROM bookings b
        JOIN vehicles v ON v.id = b.vehicle_id
        WHERE b.customer_id = $1
        ORDER BY b.id DESC;
        `,
        [user.id]
    );
    console.log("User ID:", user.id);

    const data = result.rows.map(b => ({
        id: b.id,
        vehicle_id: b.vehicle_id,
        rent_start_date: b.rent_start_date,
        rent_end_date: b.rent_end_date,
        total_price: b.total_price,
        status: b.status,
        vehicle: {
            vehicle_name: b.vehicle_name,
            registration_number: b.registration_number,
            type: b.type
        }
    }));

    return {
        success: true,
        message: "Your bookings retrieved successfully",
        data
    };
}

const updateBooking = async (
    bookingId: string, user: any, payload: Record<string, unknown>) => {

    const bookingResult = await pool.query(
        `SELECT * FROM bookings WHERE id = $1`,
        [bookingId]
    );

    if (bookingResult.rows.length === 0) {
        throw new Error("Booking not found");
    }

    const booking = bookingResult.rows[0];

    if (user.role !== "admin" && booking.customer_id !== user.id) {
        throw new Error("You can only update your own booking");
    }

    const vehicleInfo = await pool.query(
        `SELECT availability_status FROM vehicles WHERE id = $1`,
        [booking.vehicle_id]
    );

    if (vehicleInfo.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    let vehicleStatus = vehicleInfo.rows[0].availability_status;

    if (payload.status === "cancelled") {
        vehicleStatus = "available";
    }
    else if (payload.status === "returned") {
        if (user.role !== "admin") {
            throw new Error("Only admin can mark booking as returned");
        }
        vehicleStatus = "available";
    }
    else {
        throw new Error("Invalid status");
    }

    const updatedBookingInfo = await pool.query(
        `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
        [payload.status, bookingId]
    );
    const updatedBooking = updatedBookingInfo.rows[0];

    await pool.query(
        `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
        [vehicleStatus, updatedBooking.vehicle_id]
    );

    const result = await pool.query(
        `SELECT 
            b.*, 
            v.availability_status 
         FROM bookings b
         JOIN vehicles v ON b.vehicle_id = v.id
         WHERE b.id = $1`,
        [bookingId]
    );

    const row = result.rows[0];

    if (payload.status === "cancelled") {
        return {
            success: true,
            message: "Booking cancelled successfully",
            data: {
                id: row.id,
                customer_id: row.customer_id,
                vehicle_id: row.vehicle_id,
                rent_start_date: row.rent_start_date,
                rent_end_date: row.rent_end_date,
                total_price: row.total_price,
                status: row.status
            }
        };
    }

    return {
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: {
            id: row.id,
            customer_id: row.customer_id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            vehicle: {
                availability_status: row.availability_status
            }
        }
    };
};

export const bookingServices = {
    createBooking, getBooking, updateBooking
}