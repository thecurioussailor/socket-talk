import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ChatTab from "@/components/ChatTab";
import { ChangeEvent, useState } from "react";
import ChatBox from "@/components/ChatBox";
import { fetchProfile } from "./Profile";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Message {
    id: string,
    content: string
}

interface ChatParticipants {
    chatId: string,
    user: {
        id: string,
        username: string,
        profile: {
            name: string,
            avatar: string
        }
    },
    userId: string
}

interface Chat {
    id: string;
    name: string;
    isPrivate: Boolean;
    type: 'PRIVATE' | 'GROUP';
    image: string,
    messages: Message[],
    participants: ChatParticipants[]
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


const Personal = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const dropdownRef = useRef<HTMLDivElement>(null);
    const { data, isLoading, isError} = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats
    })

    const { data: profile } = useQuery({
        queryKey: ["profile"],
        queryFn: fetchProfile
      });

    const handleChatBox = (chatId: string) => {
        setSelectedChatId(chatId);
    }
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
            setIsDropdownOpen(true);
    }
    
    const filteredChats = data?.filter(chat => chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) && chat.type === 'PRIVATE');
    if(isLoading){
        return <div>Page is loading</div>
    }
    if(isError){
        return <div>Error has occured.</div>
    }
    
  return (
    <section className="bg-[#242627] text-white rounded-lg px-4 h-full">
    <header className="p-4 flex justify-between text-2xl font-semibold">
        <h1>Personal</h1>
        <div className="flex relative items-center gap-2 border border-zinc-600 rounded-lg p-1 justify-between">
                <Input
                    onChange={handleSearch} 
                    className="w-56 outline-none border-none focus-visible:ring-0"
                />
            <Button 
                className="bg-transparent hover:bg-transparent"
            >
                <SearchIcon/>
            </Button>
            {isDropdownOpen  && searchQuery && (
                    <div
                        className="absolute top-12 left-0 z-50 w-full border border-zinc-700 rounded-lg bg-[#191919] p-1"
                    >
                        <div className="flex flex-col">
                        {filteredChats && filteredChats.length > 0 ? (
                            filteredChats.map(chat => (
                                <div
                                    onClick={() => {
                                        handleChatBox(chat.id);
                                        setIsDropdownOpen(false);
                                    }} 
                                    className="border-b last:border-none p-2 text-sm cursor-pointer"
                                >
                                    {chat?.name}
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-sm text-gray-400">
                                No chats found matching "{searchQuery}"
                            </div>
                        )}
                        </div>
                    </div>
                )}
        </div>
    </header>
    <div className="gap-4">
        <div className={`grid grid-flow-col ${selectedChatId ? 'grid-cols-3': 'grid-cols-2'} justify-start gap-4 w-full`}>
            <div className={`${selectedChatId ? 'col-span-2':'hidden'}`}>
                {selectedChatId && <ChatBox chatId={selectedChatId}/>}
            </div>
            <div className="flex flex-col gap-1">
            {data?.filter(chat => chat.type === 'PRIVATE').map(chat => (
                <ChatTab 
                    key={chat.id} 
                    chatId={chat.id}
                    isSelected={selectedChatId == chat.id} 
                    chatName={chat?.participants.filter(parcipant => parcipant.userId !== profile?.id)[0].user?.profile?.name} 
                    chatType={chat.type} 
                    image={chat?.participants.filter(parcipant => parcipant.userId !== profile?.id)[0].user?.profile?.avatar}
                    lastMessage={chat.messages[0]?.content}
                    onClick={() => handleChatBox(chat.id)}
                />
            ))}
            </div>
        </div>
    </div>
</section>
  )
}

export default Personal