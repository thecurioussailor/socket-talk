import { prismaClient } from "@repo/prisma/client"
import { Request, Response } from "express"

export const userGroupInvites = async (req: Request, res: Response) => {
// Get user's group invites
    try{
        const userId = req.userId;
        const invites = await prismaClient.groupInvite.findMany({
            where: {
                inviteeId: userId,
                status: 'PENDING',
                expiresAt: {
                    gt: new Date()
                }
            },
            include: {
                chat: true,
                inviter: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });
        res.json(invites);

    }catch(error){
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

export const respondToInvite = async (req: Request, res: Response) => {
// Accept/reject group invite
// Required: status (ACCEPTED/REJECTED)
    try{
        const { inviteId } = req.params;
        const { status } = req.body;
        const userId = req.userId;

        const invite = await prismaClient.groupInvite.findFirst({
            where: {
                id: inviteId,
                inviteeId: userId,
                status: 'PENDING',
                expiresAt: {
                    gt: new Date()
                }
            }
        })

        if(!invite){
            res.status(404).json({
                message: "Invite not found or expired"
            });
            return
        }

        if(status === 'ACCEPTED'){
            await prismaClient.$transaction([
                prismaClient.chatParticipant.create({
                    data: {
                        chatId: invite.chatId,
                        userId: userId,
                        role: 'MEMBER'
                    }
                }),
                prismaClient.groupInvite.update({
                    where: {
                        id: inviteId
                    },
                    data: {
                        status
                    }
                })
            ]);
        } else {
            await prismaClient.groupInvite.update({
                where: {
                    id: inviteId
                },
                data: {
                    status
                }
            })
        }
        res.json({
            message: 'Invite updated'
        })
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}