import { NextFunction, Request, Response } from "express";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const auth = async (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                })
            }

            const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
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

export default auth;