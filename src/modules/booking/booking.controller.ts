import { Request, Response } from "express"
import { bookingServices } from "./booking.service"

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.createBooking(req.body);

        if (typeof result === 'string') {
            return res.status(400).json({
                success: false,
                message: result
            });
        }
        
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error.stack
        })
    }
}

export const bookingController = {
    createBooking,
}