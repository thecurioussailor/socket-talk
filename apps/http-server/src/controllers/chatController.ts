import { prismaClient } from "@repo/prisma/client";
import { Request, Response } from "express";

// Create new chat (private or group)
// Required: type (PRIVATE/GROUP), name (for group), participantIds
export const createNewChat = async (req: Request, res: Response) => {
    const { type, name, participantIds, isPrivate } = req.body;
    console.log(participantIds);
    const userId = req.userId;
    let newName;
    try{
        if(type === 'PRIVATE'){
            newName = participantIds[0];
        }
        const chat = await prismaClient.chat.create({
            data: {
                type,
                name: newName,
                isPrivate,
                participants: {
                    create: [
                        { userId, role: 'OWNER'},
                        ...participantIds.map((user: {userId: string}) => ({
                            userId: user.userId,
                            role: 'MEMBER'
                        }))
                    ]
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                createdAt: true,
                                updatedAt: true
                            }
                        }
                    }
                }
            }
        })
        res.json(chat);
    } catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
    
}

// Get user's chats
export const getUserChat = async (req: Request, res: Response) => {
    const userId = req.userId
    try{
        const chats = await prismaClient.chat.findMany({
            where: {
                participants: {
                    some: {
                        userId
                    }
                }
            },
            orderBy: {
                lastMessageAt: 'desc'
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    }
                },
                messages: {
                    take: 1,
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
        res.json(chats)
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Get chat details and messages
export const getChatDetailsAndMessages = async (req: Request, res: Response) => {
    try{
        const { chatId } = req.params;
        const userId = req.userId;
        const chat = await prismaClient.chat.findFirst({
            where: {
                id: chatId,
                participants: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    }
                }
            }
        })

        if(!chat){
            res.status(404).json({
                message: "Chat not found"
            })
        }

        res.status(200).json(chat)
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
// Update chat details (name, isPrivate)
export const updateChatDetails =  async (req: Request, res: Response) => {
    try{
        const { chatId } = req.params;
        const { name } = req.body;
        const userId = req.userId;

        const participant = await prismaClient.chatParticipant.findFirst({
            where: {
                chatId,
                userId,
                role: 'OWNER'
            }
        })

        if(!participant){
            res.status(403).json({
                message: "Not authorized"
            });
        }

        const chat = await prismaClient.chat.update({
            where: {
                id: chatId
            },
            data: {
                name
            }
        });

        res.json(chat);
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Delete chat (if owner)
export const deleteChatIfOwner = async (req: Request, res: Response) => {
    try{
        const { chatId } = req.params;
        const userId = req.userId;

        const participant = await prismaClient.chatParticipant.findFirst({
            where: {
                chatId,
                userId,
                role: 'OWNER'
            }
        })

        if(!participant){
            res.status(403).json({
                message: "Not Authorized"
            })
        };

        await prismaClient.chat.delete({
            where: {
                id: chatId
            }
        })

        res.status(200).json({
            message: "Chat Deleted"
        })
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Chat Participant Routes
// Add participant to chat
// Required: userId, role
export const addParticipantToChat = async (req: Request, res: Response) => {
    try{
        const { chatId } = req.params;
        const { userId, role } = req.body;
        const requesterId = req.userId;

        const requesterParticipant = await prismaClient.chatParticipant.findFirst({
            where: {
                chatId,
                userId: requesterId,
                role: {
                    in: ['OWNER', 'ADMIN']
                }
            }
        })

        if(!requesterParticipant){
            res.status(403).json({
                message: "Not authorized"
            })
            return
        }

        const participant = await prismaClient.chatParticipant.create({
            data: {
                chatId,
                userId,
                role
            }
        })
        res.status(201).json(participant)
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Update participant role
// Required: role
export const updateParticipantRole = async (req: Request, res: Response) => {
    try{
        const { chatId, userId } = req.params;
        const { role } = req.body;
        const requesterId = req.userId;

        const requesterParticipant = await prismaClient.chatParticipant.findFirst({
            where: {
                chatId,
                userId: requesterId,
                role: 'OWNER'
            }
        })

        if(!requesterParticipant){
            res.status(403).json({
                message: "Not authorized"
            })
        }

        const participant = await prismaClient.chatParticipant.update({
            where: {
                userId_chatId: {
                    userId,
                    chatId
                }
            },
            data: {
                role
            }
        })

        res.json(participant);
    }catch(error){
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
// Remove participant from chat
export const removeParticipantFromChat = async (req: Request, res: Response) => {
    try{
        const { chatId, userId } = req.params;
        const requesterId = req.userId;

        const requesterParticipant = await prismaClient.chatParticipant.findFirst({
            where: {
                chatId,
                userId: requesterId,
                role: {
                    in: ['OWNER', 'ADMIN']
                }
            }
        });

        if(!requesterParticipant){
            res.status(403).json({
                message: "Not authorized"
            });
            return
        }

        await prismaClient.chatParticipant.delete({
            where: {
                userId_chatId: {
                    userId,
                    chatId
                }
            }
        })

        res.status(200).json({
            message: "Participant removed"
        })
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Group Invite Routes
// Send group invite
// Required: inviteeId, expiresAt
export const sendGroupChatInvite = async (req: Request, res: Response) => {
    try{
        const { chatId } = req.params;
        const { inviteeId } = req.body;
        const inviterId = req.userId;

        const participant = await prismaClient.chatParticipant.findFirst({
            where: {
                chatId,
                userId: inviterId,
                role: {
                    in: ['OWNER', 'ADMIN']
                }
            }
        });

        if(!participant){
            res.json({
                message: "Not authorized"
            });
        }

        const invite = await prismaClient.groupInvite.create({
            data: {
                chatId,
                inviterId,
                inviteeId,
                expiresAt: new Date(new Date().getTime() + 2*24*60*60*1000)
            }
        });

        res.json(invite);
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


export const getAllMessagesByChatId = async (req: Request, res: Response) => {
    try{
        const { chatId } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
        const { cursor } = req.query;
        const userId = req.userId;

        const isParticipant = await prismaClient.chatParticipant.findUnique({
            where: {
                userId_chatId: {
                    userId,
                    chatId
                }
            }
        })

        if(!isParticipant){
            res.status(403).json({
                message: "You are not authorized"
            })
            return
        }
        const chatMessages = await prismaClient.message.findMany({
            where: {
                chatId
            },
            take: limit,
           ...(cursor && {
               cursor: {
                   id: cursor as string
               }
           }),
            orderBy: {
                createdAt: 'desc'
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

        const messages = chatMessages;

        res.status(200).json({
            messages,
            nextCursor: messages.length === limit ? messages[messages.length - 1].id : null, // Next cursor for pagination
          });
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
