import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "./ui/badge";
import MessageBox from "./MessageBox";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface ChatDetails {
    id: string,
    name: string,
    type: string
}

interface Message {
    id: string;
    content: string;
    type: string; // To capture the "type" field, e.g., "TEXT"
    createdAt: string;
    senderId: string; // To capture "senderId" directly
    chatId: string; // To capture "chatId" field
    sender: {
        id: string;
        username: string;
    };
}

interface FetchChatMessagesResponse {
    pages: FetchChatMessagesResponse2[];
    pageParams: any[];
}
interface FetchChatMessagesResponse2 {
    messages: Message[]; 
    nextCursor: string | null;
}

const fetchChatDetails = async (chatId: string | null) => {
    const response = await axios.get(`${BACKEND_URL}/chats/${chatId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    console.log(response.data)
    return response.data;
};


const ChatBox = ({chatId}: {chatId: string | null}) => {

    const [messageInput, setMessageInput] = useState("");
    const [isTyping, setIsTyping] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const queryClient = useQueryClient();

    const { data: chatData, isLoading } = useQuery({
        queryKey: ["chatDetails", chatId],
        queryFn: () => fetchChatDetails(chatId),
        enabled: !!chatId,
    })
    useEffect(() => {
        const token = localStorage.getItem('token');

        if(!token || !chatId){
            console.error("Token not found in localstorage");
            return;
        }

        ws.current = new WebSocket('ws://localhost:3001');

        ws.current.onopen = () => {
            console.log("Websocket connected");
            ws.current?.send(JSON.stringify({
                type: 'join_chat',
                payload: {
                    chatId,
                    token
                }
            }))
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            console.log("on message received", data);

            if(data.type === "receive_message"){
                const newMessage: Message = {
                    id: Date.now().toString(),
                    content: data.payload.message,
                    type: "TEXT",
                    senderId: data.metadata.senderId, // Replace with actual user ID
                    chatId: data.payload.chatId || "", // Replace with actual chat ID
                    sender: {
                        id: data.metadata.senderId, // Replace with actual user ID
                        username: "currentUsername" // Replace with actual username
                    },
                    createdAt: new Date().toISOString()
                };
                addMessageToCache(newMessage);
            }else if(data.type === "typing"){
                console.log("typing receive")
                setIsTyping(data.payload.message); // Update the typing user
                setTimeout(() => setIsTyping(null), 3000);
            }
            
        }
        ws.current.onclose = () => {
            console.log("WebSocket disconnected");
          };
      
          ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
          };
      
          // Cleanup WebSocket connection on component unmount
          return () => {
            ws.current?.close();
          };
    },[chatId])
    
    const handleSendMessage = () => {
        console.log("handle send message")
        setIsSending(true);
        if(!ws.current || !messageInput.trim()) return;

        const token = localStorage.getItem('token');

        ws.current.send(JSON.stringify({
            type: "send_message",
            payload: {
                chatId,
                token,
                message: messageInput.trim(),
            }
        }))
        //setting it to cache
        const newMessage: Message = {
            id: Date.now().toString(),
            content: messageInput,
            type: "TEXT",
            senderId: "currentUserId", // Replace with actual user ID
            chatId: chatId || "", // Replace with actual chat ID
            sender: {
                id: "currentUserId", // Replace with actual user ID
                username: "currentUsername" // Replace with actual username
            },
            createdAt: new Date().toISOString()
        };
        addMessageToCache(newMessage);
        setMessageInput("")
        setIsSending(false);
    }
    const handleTyping = () => {
        if(!ws.current) return;
        console.log("handle typing")
        const token = localStorage.getItem('token');
        ws.current.send(
            JSON.stringify({
                type: "typing_start",
                payload: {
                    chatId,
                    token
                }
            })
        )
    }

    const addMessageToCache = (newMessage: Message) => {
        queryClient.setQueryData<FetchChatMessagesResponse>(["messages", chatId], (oldData) => {
            if (!oldData) {
                return { pages: [{ messages: [newMessage], nextCursor: null }], pageParams: [null] }
            };

            const updatedPages = oldData.pages.map((page, index) => (index === 0
                ? { ...page, messages: [newMessage, ...page.messages] } // Add new message to the first page
                : page));

            return { ...oldData, pages: updatedPages };
        });
    };


    if (isLoading) {
        return <p>Loading...</p>;
      }
  return (
    <section className="flex flex-col justify-between items-center rounded-lg border p-4 bg-[#191919] border-zinc-700 overflow-clip pb-4">
        <div className="p-4 flex relative items-center gap-4 bg-zinc-800 w-full rounded-lg">
            <div className="f">
                <Avatar className="">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <div>
                <h1 className="font-semibold">{chatData.name}  <Badge>{chatData.type}</Badge></h1>
                <p className="text-sm text-green-300">{isTyping}</p>
            </div>
            <div className="absolute flex flex-col top-1 right-1">
                <Badge className="text-xs">chat id: {chatData.id}</Badge>
            </div>
        </div>
        {/* chat messages */}
        <MessageBox chatId={chatId}/>
        {/* Input section */}
        <div className="flex gap-2 mt-4 w-full">
            <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                    handleTyping();
                    if(e.key === "Enter"){
                        e.preventDefault();
                        handleSendMessage();
                    }
                }}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-lg bg-zinc-800 text-white outline-none"
            />
            <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-green-500 rounded-lg text-white hover:bg-green-600"
                disabled={isSending}
            >
                Send
            </button>
        </div>
    </section>
  )
}

export default ChatBox