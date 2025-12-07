
import { pool } from "../../config/db";

const getUser = async () => {
    const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);

    return result;
}

const updateUser = async (userId: string, payload: Record<string, unknown>, currentUserRole: string) => {
    let { name, email, phone, role } = payload
    if (currentUserRole === "customer") {
        role = undefined;
    }
    const result = await pool.query(`UPDATE users SET 
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            phone = COALESCE($3, phone),
            role = COALESCE($4, role)
        WHERE id = $5
        RETURNING name, email, phone, role`, [name, email, phone, role, userId])

    return result;
}


const deleteUser = async (userId: string) => {
    const getActiveBooking = await pool.query(`SELECT * FROM bookings WHERE customer_id = $1 AND status='active'`, [userId])

    if (getActiveBooking.rows[0]) {
        throw new Error("This user already booked a vehicle")
    }
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [userId])

    return result;
}

export const userServices = {
    getUser, updateUser, deleteUser
}