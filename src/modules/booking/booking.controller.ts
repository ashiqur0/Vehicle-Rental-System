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
        let result = null;
        const tokenEmail = req?.user?.email;
        const userEmail = req?.query?.email;

        if (req?.user?.role === 'admin') {
            result = await bookingServices.getBookings();
        } else if (req?.user?.role === 'customer') {
            if (tokenEmail !== userEmail) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden"
                });
            }
            
            result = await bookingServices.getBookingByOwner(userEmail as string);
        }

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No bookings found"
            });
        }

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