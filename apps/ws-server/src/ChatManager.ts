import { createClient, RedisClientType } from "redis";
import { User } from "./User";
import dotenv from "dotenv";
dotenv.config();
export interface DbUserInfo {
    name: string,
    avatar: string,
    username: string
}
type Sender = {
    senderId: string,
    dbUserInfo: DbUserInfo
}

export class ChatManager {
    private static instance: ChatManager;
    private subscriptions: Map<string, Set<User>> = new Map();
    private subscriber: RedisClientType;
    private publisher: RedisClientType;

    private constructor() {
        this.subscriber = createClient({
            url: process.env.REDIS_URL 
        });
        this.subscriber.connect();

        this.publisher = createClient({ 
            url: process.env.REDIS_URL
        });
        this.publisher.connect();
    }

    public static getInstance(){
        if (!this.instance) {
            this.instance = new ChatManager();
        }
        return this.instance;
    }

    public addUserToChat(chatId: string, user: User){
        if(!this.subscriptions.get(chatId)){
            this.subscriptions.set(chatId, new Set());
            this.subscribeToRedis(chatId);
        }
        this.subscriptions.get(chatId)?.add(user);
        console.log(`User ${user.getUserId()} added to chat ${chatId}`);
    }

    public subscribeToRedis(chatId: string){
        this.subscriber.subscribe(chatId, (data) => {
            const parsedData = JSON.parse(data.toString());
            const chatUsers = this.subscriptions.get(chatId);
            console.log(parsedData);
            const sendData = {
                type: parsedData.type === 'message' ? 'receive_message' : 'typing',
                payload: {
                    message: parsedData.message,
                    chatId: parsedData.chatId
                },
                metadata: {
                    timestamp: new Date(),
                    senderId: parsedData.senderId,
                    sender: parsedData.sender
                }
            }
            if(chatUsers){
                for(const user of chatUsers){
                    if(user.getUserId() !== parsedData.senderId){
                        user.send(JSON.stringify(sendData));
                    }
                }
            }
        })
    }

    public sendMessageToChat(sender: Sender, chatId: string, payloadMessage: {type: string, message: string}){
        const { type, message} = payloadMessage;
        const { senderId } = sender;
        console.log("Message",message);
        const payload = JSON.stringify({
            type,
            senderId,
            sender,
            chatId,
            message
        })
        this.publisher.publish(chatId, payload);
        console.log(`Message published to chat ${chatId}: ${message}`);
    }

    public unsubscribeFromChat(chatId: string, user: User){
        const chatUsers = this.subscriptions.get(chatId);
        if(chatUsers){
            chatUsers.delete(user);
        }
        console.log(`User ${user.getUserId()} unsubscribed from chat ${chatId}`);
    }

    public pushMessageToQueue(queueName: string, message: object) {
        const payload = JSON.stringify(message);
        this.publisher.lPush(queueName, payload);
        console.log(`Message pushed to queue ${queueName}:`, payload);
    }
    
}
