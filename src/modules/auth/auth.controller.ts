import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signup = async (req: Request, res: Response) => {
    try {
        const result = await authServices.signup(req.body);

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long. Name, email, and phone are required. Email must be in lowercase."
            });
        }

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
}

const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await authServices.signin(email, password);

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        })
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
    signin
}