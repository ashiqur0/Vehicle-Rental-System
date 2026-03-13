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

const getVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getVehicles();

        if (result.rowCount === 0) {
            return res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: result.rows
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
}

const getSingleVehicle = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    try {
        const result = await vehicleServices.getSingleVehicle(vehicleId as string);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    try {
        const result = await vehicleServices.updateVehicle(req.body, vehicleId as string);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    try {
        const result = await vehicleServices.deleteVehicle(vehicleId as string);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        });
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
    getVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
}