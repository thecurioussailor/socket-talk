import { prismaClient } from "@repo/prisma/client";
import { Request, Response } from "express";

export const getUserProfile = async (req: Request, res: Response) => {
    const userId = req.userId;
    try{
        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                username: true,
                createdAt: true, //joined date
                updatedAt: true // last modified date
            }
        })
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({
            message: "Server Error" + error
        })
    }
}

export const getUserProfileById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try{
        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                username: true,
                createdAt: true
            }
        })

        if(!user){
            res.status(404).json({
                message: "User not found"
            })
            return
        }
        res.status(200).json(user)
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getUserProfileByUsername = async (req: Request, res: Response) => {
    const { username } = req.params;
    try{
        const user = await prismaClient.user.findUnique({
            where: {
                username 
            },
            select: {
                id: true,
                username: true,
                createdAt: true
            }
        })

        if(!user){
            res.status(404).json({
                message: "User not found"
            })
            return
        }
        res.status(200).json(user)
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}