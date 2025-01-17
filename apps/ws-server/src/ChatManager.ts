import { createClient, RedisClientType } from "redis";
import { User } from "./User";

export class ChatManager {
    private static instance: ChatManager;
    private subscriptions: Map<string, Set<User>> = new Map();
    private subscriber: RedisClientType;
    private publisher: RedisClientType;

    private constructor() {
        this.subscriber = createClient({
            url: "redis://localhost:6379" 
        });
        this.subscriber.connect();

        this.publisher = createClient({ 
            url: "redis://localhost:6379"
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

            if(chatUsers){
                for(const user of chatUsers){
                    if(user.getUserId() !== parsedData.senderId){
                        user.send(parsedData.message);
                    }
                }
            }
        })
    }

    public sendMessageToChat(senderId: string, chatId: string, payloadMessage: {type: string, message: string}){
        const { type, message} = payloadMessage;
        console.log(payloadMessage);
        console.log("Message",message);
        const payload = JSON.stringify({
            type,
            senderId,
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
