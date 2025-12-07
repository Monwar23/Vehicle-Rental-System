import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.createVehicle(req.body);
        // console.log(result.rows[0]);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result.rows[0]
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const getVehicle= async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getVehicle();
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getSingleVehicle(req.params.vehicleId as string);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Vehicle not found" });
        }else{
            res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0]
        })
        };
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
};

const updateVehicle =  async (req: Request, res: Response) => {
    const payload = req.body
    try {
        const result = await vehicleServices.updateVehicle(req.params.vehicleId as string, payload);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle updated successfully",
                data: result.rows[0]
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const deleteVehicle= async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.deleteVehicle(req.params.vehicleId as string);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully",
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}


export const vehicleControllers = {
    createVehicle, getVehicle, getSingleVehicle, updateVehicle, deleteVehicle
}