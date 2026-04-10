import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let token = req.headers.authorization;

        if (token && token.startsWith('Bearer')) {
            try {
                token = token.split(' ')[1];

                const decoded = jwt.verify(token!, config.jwt_secret as string) as JwtPayload;
                req.user = decoded;

                if (roles.length && !roles.includes(decoded.role)) {
                    return res.status(403).json({
                        success: false,
                        message: "Forbidden"
                    });
                }

                next();
            } catch (error) {
                res.status(401).json({ success: false, message: 'Not authorized, token failed' });
            }
        } else {
            res.status(401).json({ success: false, message: 'No token, authorization denied' });
        }
    }
}

export default auth;