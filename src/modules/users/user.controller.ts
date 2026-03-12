import { Request, Response } from "express";
import { userServices } from "./user.service";

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUsers();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
}

const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const result = await userServices.updateUser(req.body, userId as string);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
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
    getUsers,
    updateUser,
}