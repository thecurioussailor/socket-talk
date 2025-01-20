import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Message {
    id: string,
    content: string,
    sender: {
        id: string,
        username: string
    };
    createdAt: string
}

const fetchChatMessages = async (chatId: string | null, cursor: string | null): Promise<Message[]> => {
    const params = new URLSearchParams();
    params.append("limit", "20");
    if(cursor){
        params.append("cursor", cursor);
    }

    const response = await axios.get(`${BACKEND_URL}/chats/${chatId}/messages?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    console.log(response.data)
    return response.data.messages;
}


const MessageBox = ({chatId}: {chatId: string | null}) => {

    const scrollRef = useRef<HTMLDivElement>(null);
    const {data, isLoading } = useQuery({
        queryKey: ["messages", chatId],
        queryFn: () => fetchChatMessages(chatId, null),
        enabled: !!chatId
    })
      
    useEffect(() => {
        if(data && scrollRef.current){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            const lastMessageDiv: HTMLDivElement = scrollRef.current.lastChild!.lastChild!.lastChild as HTMLDivElement;
            lastMessageDiv.scrollIntoView({ behavior: 'auto' });
        }
    }, [data])
    
    if(isLoading){
        return <div>loading...</div>
    }
  return (
    <ScrollArea ref={scrollRef} className=" mt-4 w-full h-96 overflow-y-auto bg-zinc-900 p-4">
        {data?.map(message => (
            <div key={message.id} className="border rounded-lg justify-between flex gap-2 p-2 mb-2">
                <p>{message.sender.username}</p>
                <p>{message.content}</p>
                <p>{new Date(message.createdAt).toLocaleDateString("en-IN", {
              timeZone: "Asia/Kolkata", // Set IST (Indian Standard Time) explicitly
              weekday: "long",           // Show day of the week
              year: "numeric",          // Show full year
              month: "long",            // Show full month name
              day: "numeric",           // Show day of the month
            })}
            {" "}
            -{" "}
            {new Date(message.createdAt).toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata", // Set IST
              hour12: true,             // Use 12-hour format
              hour: "2-digit",          // Show hours in 2 digits
              minute: "2-digit",        // Show minutes in 2 digits
            })}</p>
            </div>
        ))}
        
    </ScrollArea>
  )
}

export default MessageBox