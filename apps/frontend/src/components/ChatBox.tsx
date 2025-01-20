import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "./ui/badge";
import MessageBox from "./MessageBox";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface ChatDetails {

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

    const [messages, setMessages] = useState<string[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const ws = useRef<WebSocket | null>(null);

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
            const message = event.data;
            setMessages((prevMessages) => [...prevMessages, message]);
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
    if (isLoading) {
        return <p>Loading...</p>;
      }
    const handleSendMessage = () => {
        console.log("handle send message")
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
                <p className="text-sm text-green-300">Ram is typing...{}</p>
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
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-lg bg-zinc-800 text-white outline-none"
            />
            <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-green-500 rounded-lg text-white hover:bg-green-600"
            >
                Send
            </button>
        </div>
    </section>
  )
}

export default ChatBox