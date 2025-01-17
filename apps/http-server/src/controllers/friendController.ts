import { prismaClient } from "@repo/prisma/client";
import { Request, Response } from "express";

// Get user's friends list
export const getUsersFriendList = async (req: Request, res: Response) => {
    const userId = req.userId;
    try{
        const friends = await prismaClient.friend.findMany({
            where: {
                userId: userId
            },
            include: {
                friend: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        res.status(200).json(friends.map(f => f.friend))

    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Send friend request
export const sendFriendRequest = async (req: Request, res: Response) => {
    const { userId: receiverId } = req.params;
    const senderId = req.userId;
    try{
    const existingRequest = await prismaClient.friendRequest.findUnique({
        where: {
            senderId_receiverId: {senderId, receiverId}
        }
    });

    if(existingRequest){
        res.status(400).json({
            message: "Friend Request already sent"
        });
        return
    }

    const friendRequest = await prismaClient.friendRequest.create({
        data: {
            senderId,
            receiverId
        }
    })

    res.status(201).json(friendRequest)

    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Get all friend requests (sent and received)
export const getAllFriendRequests = async (req: Request, res: Response) => {
    const userId = req.userId;
    try{
        const [sent, received] = await Promise.all([
            prismaClient.friendRequest.findMany({
                where: {
                    senderId: userId
                },
                include: {
                    receiver: {
                        select: {
                            id: true,
                            username: true
                        }
                    }
                }
            }),
            prismaClient.friendRequest.findMany({
                where: {
                    receiverId: userId
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            username: true
                        }
                    }
                }
            })
        ]);

        res.status(200).json({
            sent,
            received
        })
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Accept/reject friend request
// Required: status (ACCEPTED/REJECTED)
export const respondToFriendRequest = async (req: Request, res: Response) => {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.userId;
    try{
    const request = await prismaClient.friendRequest.findFirst({
        where: {
            id: requestId,
            receiverId: userId
        }
    })

    if(!request){
        res.status(404).json({
            message: "Request not found"
        })
        return
    }

    if(status === "ACCEPTED"){
        await prismaClient.$transaction([
            prismaClient.friend.create({
                data: {
                    userId: request.senderId,
                    friendId: request.receiverId
                }
            }),
            prismaClient.friend.create({
                data: {
                    userId: request.receiverId,
                    friendId: request.senderId
                }
            }),
            prismaClient.friendRequest.update({
                where: {
                    id: requestId
                },
                data: {
                    status
                }
            })
        ]);
    }else {
        await prismaClient.friendRequest.update({
            where: {
                id: requestId
            },
            data: {
                status
            }
        })
    }

    res.json({
        message: 'Request updated'
    });
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Remove friend
export const removeFriend =  async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const userId = req.userId;
    console.log("friendId userId", friendId, userId)
    try{
        await prismaClient.$transaction([
            prismaClient.friend.deleteMany({
                where: {
                    OR: [
                        { userId, friendId},
                        { userId: friendId, friendId: userId}
                    ]
                }
            }),
            prismaClient.friendRequest.deleteMany({
                where: {
                    OR: [
                        {
                            senderId: userId,
                            receiverId: friendId
                        },
                        {
                            senderId: friendId,
                            receiverId: userId
                        }
                    ]
                }
            })
        ]);

        res.json({
            message: "Friend removed"
    });
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}