import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    
    const header = req.headers.authorization;
    const jwtToken = header?.split(' ')[1];

    if(!jwtToken){
        res.status(401).json({
            message: "Unauthorized"
        })
        return
    }

    try{
        const decoded = jwt.verify(jwtToken, JWT_SECRET!) as { userId: string};
        req.userId = decoded.userId;
        next();
    }catch(error){
        res.status(401).json({
            message: "Invalid Token"
        })
    }
}