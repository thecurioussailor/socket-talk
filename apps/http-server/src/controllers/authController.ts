import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/prisma/client"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
export const register = async (req: Request, res: Response) => {

    const { username, password } = req.body;

    if(!username || !password){
        res.status(400).json({
            message: "Validation Error"
        })
        return
    }
    const existingUser = await prismaClient.user.findUnique({
        where: {
            username
        }
    })

    if(existingUser){
        res.status(409).json({ // Use 409 Conflict for existing resource
            error: "UserAlreadyExists",
            message: "User already exists. Please choose a different username."
        });
        return
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prismaClient.user.create({
            data: { 
                username, 
                password: hashedPassword 
            },
        });

        res.status(201).json({ message: 'User registered successfully' });
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try{
        const user = await prismaClient.user.findUnique({
            where: {
                username
            }
        })
        if(!user || !(await bcrypt.compare(password, user.password))){
            res.status(401).json({
                message: "Invalid Credentials"
            })
            return
        }

        const token = jwt.sign({userId: user.id}, JWT_SECRET!);

        res.status(200).json({
            token
        })
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}