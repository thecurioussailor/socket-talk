import { WebSocket } from "ws";
import { prismaClient } from "@repo/prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ChatManager, DbUserInfo } from "./ChatManager";
dotenv.config();
export interface ChatMessage {
    token: string;
    chatId: string;
    message: string;
  }
  
  export enum ChatType {
    PRIVATE = 'PRIVATE',
    GROUP = 'GROUP'
  }
  
  export enum ChatRole {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
    GUEST = 'GUEST'
  }
export class User {
    private dbUserId?: string;
    private dbUserAvatar?: string | null;
    private dbNameUser?: string | null;
    private dbUsername?: string | null;

    constructor(
        private id: string, 
        private ws: WebSocket,
    ){
        this.addListners()
    }

    send(message: string){
        this.ws.send(message)
    }

    getUserId (){
        return this.id;
    }
    getUserByDbUserId(dbUserId: string){
        return dbUserId === this.dbUserId ? this : null;
    }
    getUserInfo (): DbUserInfo{
        const dbUserInfo = {
            name: this.dbNameUser ?? "Unknown User",
            avatar: this.dbUserAvatar ?? "",
            username: this.dbUsername ?? "anonymous"
        }
        return dbUserInfo;
    }
    async verifyParticipant(chatId: string, dbUserId: string): Promise<boolean> {
        const participant = await prismaClient.chatParticipant.findUnique({
          where: {
            userId_chatId: {
              userId: dbUserId,
              chatId: chatId
            }
          },
          include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    profile: {
                        select: {
                            name: true,
                            avatar: true
                        }
                    }
                }
            }
          }
        });
        this.dbUserAvatar = participant?.user.profile?.avatar;
        this.dbNameUser = participant?.user.profile?.name;
        this.dbUsername = participant?.user.username;
        return !!participant;
    }

    private addListners(){
        this.ws.on('message', (data: string) => {
            try{
                const parsedData: any = JSON.parse(data);
            switch(parsedData.type){
                case 'join_chat': 
                    this.handleJoinChat(parsedData.payload);
                    break;
                case 'leave_chat':
                    this.handleLeaveChat(parsedData.payload);
                    break;
                case 'typing_start':
                    this.handleTypingStart(parsedData.payload);
                    break;
                case 'send_message':
                    this.handleSendMessage(parsedData.payload);
                
            }
            }catch(error){
                console.log(`Failed to process user messages:`, error)
            }
            
        })

        this.ws.on('close', () => {
            console.log(`User ${this.id} left the chat.`)
        })
    }

    private async handleJoinChat(payload: { chatId: string; token: string}){
        const { chatId, token } = payload;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
            this.dbUserId = decoded.userId;
            console.log(decoded);
            if (!this.dbUserId || !(await this.verifyParticipant(chatId, this.dbUserId))) {
                this.ws.close();
                return;
            }

            ChatManager.getInstance().addUserToChat(chatId, this);
            console.log(`User ${this.dbUserId} joined chat ${chatId}`);
        } catch (err) {
            console.error("Invalid token or verification failed:", err);
            this.ws.close();
        }
    }

    private async handleSendMessage(payload: ChatMessage) {
        const { chatId, token, message} = payload;
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string};
            const dbUserId = decoded.userId;
            // Store lpush to queue for DB
            ChatManager.getInstance().pushMessageToQueue("db_update_message", {
                chatId,
                senderId: dbUserId,
                message,
                timeStamp: new Date().toISOString()
            });
            const payload = {
                type: "message",
                message: message
            }
            const user = this.getUserByDbUserId(dbUserId);
            console.log(user);
            if (!user) {
                console.error(`User with ID ${dbUserId} not found.`);
                return;
            }
            const sender = {
                senderId: user.getUserId(),
                dbUserInfo: this.getUserInfo()
            }
            console.log(JSON.stringify(sender));
            ChatManager.getInstance().sendMessageToChat(sender, chatId, payload);
        }catch(error){
            console.error("Failed to handle send message", error)
        }
    }
    private async handleLeaveChat(payload: { chatId: string; token: string }){
        const { chatId, token } = payload;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
            const dbUserId = decoded.userId;

            ChatManager.getInstance().unsubscribeFromChat(chatId, this.getUserByDbUserId(dbUserId)!);
            console.log(`User ${dbUserId} left chat ${chatId}`);
        } catch (err) {
            console.error("Invalid token or verification failed:", err);
        }
    }
    
    private async handleTypingStart(payload: {chatId: string, token: string}){
        const { chatId, token } = payload;

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string};
            const dbUserId = decoded.userId;

            if(!dbUserId){
                console.error(`User ${dbUserId} is not a participant of chat ${chatId}`);
                return;
            }

            const payload = {
                type: "typing_start",
                message: `${this.dbNameUser} is typing`
            }
            const sender = {
                senderId: this.getUserByDbUserId(dbUserId)?.getUserId()!,
                dbUserInfo: this.getUserInfo()
            }
            ChatManager.getInstance().sendMessageToChat(sender, chatId, payload)

            console.log(`User ${dbUserId} started typing in chat ${chatId}`);
        }catch(error){
            console.error("Failed to handle typing start:", error);
        }
    }
}