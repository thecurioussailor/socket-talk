import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import ChatBox from "@/components/ChatBox";
import ChatTab from "@/components/ChatTab";
import { MdGroupAdd } from "react-icons/md";
import CreateGroupDialog from "@/components/CreateGroupDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    image: string,
    messages: Message[]
}

const fetchChats = async (): Promise<Chat[]> => {
    const response = await axios.get(`${BACKEND_URL}/chats`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    return response.data
}


const Group = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
    const [search, setSearch] = useState("");
    const { data, isLoading, isError} = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats
    })

    const handleChatBox = (chatId: string) => {
        setSelectedChatId(chatId);
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setIsDropdownOpen(true);
    }

    const filteredChats = data?.filter(chat => chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) && chat.type === 'GROUP');
    
    if(isLoading){
        return <div>Page is loading</div>
    }
    if(isError){
        return <div>Error has occured.</div>
    }
    
  return (
    <section className="bg-[#242627] text-white rounded-lg px-4 h-full">
    <header className="p-4 flex justify-between text-2xl font-semibold">
        <h1>Groups</h1>
        <div className="flex items-center gap-4">
        <Button
            onClick={() => setIsCreateGroupDialogOpen(true)} 
            className="bg-zinc-800 border border-zinc-600"
        >
            Create Group <MdGroupAdd />
        </Button>
        {isCreateGroupDialogOpen && <CreateGroupDialog onClose={() => setIsCreateGroupDialogOpen(false)}/>}
        <div className="flex relative items-center gap-2 border border-zinc-600 rounded-lg p-1 justify-between">
            <Input
                    onChange={handleSearch} 
                    className="w-56 outline-none border-none focus-visible:ring-0"
                    placeholder="Search Group"
            />
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
        </div>
    </header>
    <div>
        <Tabs defaultValue="friends" className="w-full">
            <TabsList>
                <TabsTrigger value="friends">Groups</TabsTrigger>
                <TabsTrigger value="pendingrequest">Invites Received</TabsTrigger>
                <TabsTrigger value="sentrequest">Invites Sent</TabsTrigger>
            </TabsList>
            <TabsContent value="friends" className="w-full py-2">
            
                <div className={`grid grid-flow-col ${selectedChatId ? 'grid-cols-3': 'grid-cols-2'} justify-start gap-4 h-[540px] w-full`}>
                    <div className={`${selectedChatId ? 'col-span-2':'hidden'}`}>
                        {selectedChatId && <ChatBox chatId={selectedChatId}/>}
                    </div>
                    <ScrollArea className="px-4 col-span-2">
                    <div className={`flex flex-col gap-1 h-full ${selectedChatId ? 'w-full' : 'w-1/2'}`}>
                    {data?.filter(chat => chat.type === 'GROUP').map(chat => (
                        <ChatTab 
                            key={chat.id} 
                            chatId={chat.id}
                            isSelected={selectedChatId == chat.id} 
                            chatName={chat?.name} 
                            chatType={chat.type} 
                            image={chat?.image}
                            lastMessage={chat.messages[0]?.content}
                            onClick={() => handleChatBox(chat.id)}
                        />
                    ))}
                    </div>
                    </ScrollArea>
                </div>
        
            </TabsContent>
            <TabsContent value="pendingrequest">Change your password here.</TabsContent>
            <TabsContent value="sentrequest">Change your password here.</TabsContent>
        </Tabs>
    </div>
</section>
  )
}

export default Group