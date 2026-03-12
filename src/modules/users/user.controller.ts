import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.createUser(req.body);

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long. Name, email, and phone are required."
            });
        }
        
        res.status(201).json({
            success: true,
            message: "User created successfully",
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

export const userController = {
    createUser,
}