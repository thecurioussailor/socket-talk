import { prismaClient } from "@repo/prisma/client";
import { createClient } from "redis";

const redisClient = createClient({
    url: "redis://localhost:6379",
});

const queueName = "db_update_message";

async function processManager() {
    await redisClient.connect();

    console.log("Consumer connected to Redis. Waiting for messages...");

    while(true){
        try{
            const result = await redisClient.blPop(queueName, 0);
            console.log(result);
            if(result){
                const {key, element} = result;
                const parsedData = JSON.parse(element);
                console.log("Processing message", parsedData);

                const {chatId, senderId, message, timeStamp} = parsedData;

                await prismaClient.$transaction([
                    prismaClient.message.create({
                        data: {
                            chatId,
                            senderId,
                            content: message,
                            createdAt: new Date(timeStamp)
                        }
                    }),
                    prismaClient.chat.update({
                        where: {
                            id: chatId
                        },
                        data: {
                            lastMessageAt: new Date(timeStamp)
                        }
                    })
                ])
                console.log("Message successfully stored in the database");
            }
           
        }catch(error){
            console.error("Error processing message:", error);
        }
    }
}

processManager().catch((err) => {
    console.error("Failed to start the consumer:", err);
    process.exit(1);
});