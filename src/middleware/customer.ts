import { NextFunction, Request, Response } from "express";

const verifyCustomer = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (role !== req?.user?.role) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden"
                });
            }

            next();
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
                details: error.stack
            })
        }
    }
};

export default verifyCustomer;