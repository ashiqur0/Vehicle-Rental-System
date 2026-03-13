import { NextFunction, Request, Response } from "express";

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req?.user?.role != 'admin') {
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
};

export default verifyAdmin;