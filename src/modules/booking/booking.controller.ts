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

const getBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.getBookings();
        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
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

const updateBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const result = await bookingServices.updateBooking(bookingId as string, req.body);

        res.status(200).json({
            success: true,
            message: "Booking updated successfully",
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
    getBookings,
    updateBooking
}