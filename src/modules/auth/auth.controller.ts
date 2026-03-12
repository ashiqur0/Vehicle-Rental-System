import { Request, Response } from "express";
import { authSearvices } from "./auth.service";


const signup = async (req: Request, res: Response) => {
    try {
        const result = await authSearvices.signup(req.body);

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

export const authController = {
    signup,
}