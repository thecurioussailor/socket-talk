import ChatBox from "@/components/ChatBox";
import ChatTab from "@/components/ChatTab";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
interface Message {
    id: string,
    content: string
}
interface Chat {
    id: string;
    name: string;
    isPrivate: Boolean;
    type: 'PRIVATE' | 'GROUP';
    messages: Message[]
}
const fetchChats = async (): Promise<Chat[]> => {
    const response = await axios.get(`${BACKEND_URL}/chats`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    console.log(response.data);
    return response.data
}
const Chats = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const { data, isLoading, isError} = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats
    })
    
    const handleChatBox = (chatId: string) => {
        setSelectedChatId(chatId);
    }
    if(isLoading){
        return <div>Page is loading</div>
    }
    if(isError){
        return <div>Error has occured.</div>
    }


  return (
    <section className="bg-[#242627] text-white rounded-lg p-4 h-full">
        <header className="p-4 flex justify-between text-2xl font-semibold">
            <h1>All Chats</h1>
            <div className="flex items-center gap-2 border rounded-lg p-1 justify-between">
                <Input className="w-56 outline-none border-none focus:outline-none focus:border-none"/>
                <Button>
                    <SearchIcon/>
                </Button>
            </div>
        </header>
        <div className="grid grid-flow-col grid-cols-3 justify-start gap-2 w-full">
            <div className="">
                {selectedChatId && <ChatBox chatId={selectedChatId}/>}
            </div>
            <div className="flex flex-col gap-2">
            {data?.map(chat => (
                <ChatTab 
                    key={chat.id} 
                    chatId={chat.id} 
                    chatName={chat.name} 
                    chatType={chat.type} 
                    lastMessage={chat.messages[0]?.content}
                    onClick={() => handleChatBox(chat.id)}
                />
            ))}
            </div>
        </div>
    </section>
  )
}

export default Chats