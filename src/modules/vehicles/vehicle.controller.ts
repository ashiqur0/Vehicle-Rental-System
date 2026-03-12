import { Request, Response } from "express"
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.createVehicle(req.body);
        
        res.status(201).json({
            success: true,
            message: "Vehicle created successfull",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
}

export const vehicleController = {
    createVehicle,
}