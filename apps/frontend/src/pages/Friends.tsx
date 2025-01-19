import FriendTab from "@/components/FriendTab";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import UserProfileCard from "@/components/UserProfileCard";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
interface FriendType {
    id: string,
    username: string   
}
const fetchFriends = async (): Promise<FriendType[]> => {
    const response = await axios.get(`${BACKEND_URL}/friends`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    return response.data
}
const Friends = () => {
    const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
    const {data, isError, isLoading} = useQuery({
        queryKey: ["friends"],
        queryFn: fetchFriends
    })
    const handleProfile = (id: string) => {
        setSelectedFriendId(id)
    }
    if(isLoading){
        <div>Loading...</div>
    }
    if(isError){
        <div>Error</div>
    }
  return (
    <section className="bg-[#242627] text-white rounded-lg p-4 h-full">
    <header className="p-4 flex justify-between text-2xl font-semibold">
        <h1>Friends</h1>
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
                <TabsTrigger value="friends">Friends</TabsTrigger>
                <TabsTrigger value="pendingrequest">Requests Received</TabsTrigger>
                <TabsTrigger value="sentrequest">Requests Sent</TabsTrigger>
            </TabsList>
            <TabsContent value="friends" className="w-full py-2">
            <div className="flex flex-col justify-start gap-2">
                {data?.map(friend => (
                    <FriendTab  key={friend.id} username={friend.username} onClick={() => handleProfile(friend.id)}/>
                ))}
            </div>
            </TabsContent>
            <TabsContent value="pendingrequest">Change your password here.</TabsContent>
            <TabsContent value="sentrequest">Change your password here.</TabsContent>
        </Tabs>
        <div>
            {
                selectedFriendId && (
                    <UserProfileCard id={selectedFriendId}/>
                )
            }
        </div>
    </div>
</section>
  )
}

export default Friends