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

const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const result = await userServices.deleteUser(userId as string);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });
        }
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
    deleteUser
}