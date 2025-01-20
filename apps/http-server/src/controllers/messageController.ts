import { prismaClient } from "@repo/prisma/client";
import { Request, Response } from "express"

export const deleteMessage = async (req: Request, res: Response) => {
    try{
        const { messageId } = req.params;
        const userId = req.userId;

        const message = await prismaClient.message.findUnique({
            where: {
                id: messageId
            }
        })

        if(!message){
            res.status(404).json({
                error: "Message not found"
            })
            return
        }

        if(message?.senderId !== userId){
            res.status(403).json({
                error: "Not authorized to delete this message"
            });
        }

        await prismaClient.message.delete({
            where: {
                id: messageId
            }
        })

        res.status(200).json({
            message: "Message deleted successfully"
        })
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}