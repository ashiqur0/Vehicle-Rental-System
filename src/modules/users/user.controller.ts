import { Request, Response } from "express";
import { userServices } from "./user.service";

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUsers();

        if (result.rowCount === 0) {
            return res.status(200).json({
                success: true,
                message: "No users found"
            });
        }

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
    const { email } = req.query;

    try {

        let result = null;

        if (req?.user?.role === 'admin') {
            result = await userServices.updateUserByAdmin(req.body, userId as string);
        } else if (req?.user?.role === 'customer') {
            if (email !== req?.user?.email) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to update this user"
                });
            }

            result = await userServices.updateUserByOwner(req.body, userId as string);
        }
        
        if (result === null) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: result
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

const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const result = await userServices.deleteUser(userId as string);

        if (!result.id) {
            return res.status(404).json({
                success: false,
                message: "The customer has an active booking. So, cannot be deleted"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: result
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