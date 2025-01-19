import FriendTab from "@/components/FriendTab";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import UserProfileCard from "@/components/UserProfileCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Chat {
    id: string;
    name: string;
    isPrivate: Boolean;
    type: 'PRIVATE' | 'GROUP'
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
    const { data, isLoading, isError} = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats
    })

    if(isLoading){
        return <div>Page is loading</div>
    }
    if(isError){
        return <div>Error has occured.</div>
    }
    
  return (
    <section className="bg-[#242627] text-white rounded-lg p-4 h-full">
    <header className="p-4 flex justify-between text-2xl font-semibold">
        <h1>Groups</h1>
        <div className="flex items-center gap-2 border rounded-lg p-1 justify-between">
            <Input className="w-56 outline-none border-none focus:outline-none focus:border-none"/>
            <Button>
                <SearchIcon/>
            </Button>
        </div>
    </header>
    <div className="grid grid-cols-2 gap-4">
        <Tabs defaultValue="friends" className="w-full">
            <TabsList>
                <TabsTrigger value="friends">Groups</TabsTrigger>
                <TabsTrigger value="pendingrequest">Invites Received</TabsTrigger>
                <TabsTrigger value="sentrequest">Invites Sent</TabsTrigger>
            </TabsList>
            <TabsContent value="friends" className="w-full py-2">
            <div className="flex flex-col justify-start gap-2">
            {data?.filter((chat) => chat.type === "GROUP").map((chat) => (
                <Button
                className="flex justify-between items-center h-24 rounded-2xl border border-zinc-700"
                key={chat.id}
                >
                <div className="flex items-center gap-4 p-4">
                    <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                    <p className="text-left text-lg">{chat.name}</p>
                    <p className="text-left text-xs">Last message...</p>
                    </div>
                </div>
                <div>
                    <Badge>{chat.type}</Badge>
                </div>
            </Button>
          ))}
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