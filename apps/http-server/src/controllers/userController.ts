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
                createdAt: true,
                updatedAt: true,
                profile: true
            }
        })
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({
            message: "Server Error" + error
        })
    }
}

export const updateUserProfile = async ( req: Request, res: Response ) => {
    const userId = req.userId;

    const {
        name,
        avatar,
        coverImage,
        bio,
        languages,
        location,
        instagram,
        x,
        discord,
        interests
    } = req.body;

    try{

        const profile = await prismaClient.profile.upsert({
            where: {
                userId
            },
            create: {
                userId,
                name,
                avatar,
                coverImage,
                bio,
                languages,
                location,
                instagram,
                x,
                discord,
                interests,
              },
              update: {
                name,
                avatar,
                coverImage,
                bio,
                languages,
                location,
                instagram,
                x,
                discord,
                interests,
              },
        });
        res.status(200).json(profile);
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
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
                createdAt: true,
                profile: true
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
                createdAt: true,
                profile: {
                    select: {
                        name: true,
                        avatar: true,
                        coverImage: true,
                        bio: true,
                        languages: true,
                        location: true,
                        instagram: true,
                        x: true,
                        discord: true,
                        interests: true,
                    }
                }
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