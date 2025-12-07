import { pool } from "../../config/db";


const AUTO_RETURN_INTERVAL = 60 * 1000;

const autoReturn = async () => {
     try {
          const result = await pool.query(`
            SELECT * FROM bookings
            WHERE status = 'active' AND rent_end_date <= NOW()
        `);

          for (const booking of result.rows) {
               await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [booking.id]);
               await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);
          }
     } catch (error: any) {
          console.error("Auto-return failed:", error.message);
     }
};

setInterval(autoReturn, AUTO_RETURN_INTERVAL);