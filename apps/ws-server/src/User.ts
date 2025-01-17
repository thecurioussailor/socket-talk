import { WebSocket } from "ws";
import { prismaClient } from "@repo/prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ChatManager } from "./ChatManager";
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
        if(dbUserId === this.dbUserId)
        return this
    }

    async verifyParticipant(chatId: string, dbUserId: string): Promise<boolean> {
        const participant = await prismaClient.chatParticipant.findUnique({
          where: {
            userId_chatId: {
              userId: dbUserId,
              chatId: chatId
            }
          }
        });
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
            ChatManager.getInstance().sendMessageToChat(this.getUserByDbUserId(dbUserId)?.getUserId()!, chatId, payload);
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
                message: `${dbUserId} is typing`
            }
            ChatManager.getInstance().sendMessageToChat(this.getUserByDbUserId(dbUserId)?.getUserId()!, chatId, payload)

            console.log(`User ${dbUserId} started typing in chat ${chatId}`);
        }catch(error){
            console.error("Failed to handle typing start:", error);
        }
    }
}