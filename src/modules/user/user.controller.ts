import { Request, Response } from "express";
import { userServices } from "./user.service";

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
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

const updateUser = async (req: Request, res: Response) => {
    const payload = req.body
    try {
        console.log(req.user!.id);
        console.log(req.params.userId);
         if (req.user!.role === "customer" && req.user!.id !== Number(req.params.userId)) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own profile!"
            });
        }
        const result = await userServices.updateUser(req.params.userId as string, payload, req.user!.role) as any;
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User updated successfully",
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

const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.deleteUser(req.params.userId as string);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
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


export const userControllers = {
    getUser, updateUser, deleteUser
}