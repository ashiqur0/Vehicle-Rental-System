import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";

const isCustomer = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: No token provided"
                });
            }

            const decoded = jwt.verify(token, config.connection_string as string) as JwtPayload;
            console.log({ decoded });

            if (!role.length || role !== decoded.role) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: Insufficient permissions"
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

export default isCustomer;