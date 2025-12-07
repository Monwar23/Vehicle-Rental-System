import { Request, Response } from "express";
import { bookingServices } from "./booking.service";


const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.createBooking(req.body);
        // console.log(result.rows[0]);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result.rows[0]
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};
const getBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.getBooking(req.user!);
        res.status(200).json(result)

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const updateBooking = async (req: Request, res: Response) => {
    const payload = req.body
    try {
        const result = await bookingServices.updateBooking(req.params.bookingId as string, req.user, payload) as any;

        res.status(200).json({result})

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}


export const bookingControllers = {
    createBooking, getBooking, updateBooking
}