
import { pool } from "../../config/db";


const createVehicle = async (payload: Record<string, unknown>) => {
    const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = payload
    const result = await pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);

    return result;
}

const getVehicle = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);

    return result;
}

const getSingleVehicle = async (vehicleId:string) => {
    const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [vehicleId])

    return result;
}

const updateVehicle = async (vehicleId:string, payload: any) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result = await pool.query(`UPDATE vehicles SET 
            vehicle_name = COALESCE($1, vehicle_name),
            type = COALESCE($2, type),
            registration_number = COALESCE($3, registration_number),
            daily_rent_price = COALESCE($4, daily_rent_price),
            availability_status = COALESCE($5, availability_status)
        WHERE id = $6
        RETURNING *`, [vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status,
            vehicleId])

    return result;
}

const deleteVehicle = async (vehicleId:string) => {
    const getVehicleById = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId])
     const currentVehicle = getVehicleById.rows[0]
     if (currentVehicle.availability_status !== "available") {
          throw new Error("Vehicle cannot be deleted while booked");
     }

    const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [vehicleId])

    return result;
}

export const vehicleServices = {
    createVehicle, getVehicle, getSingleVehicle, updateVehicle, deleteVehicle
}