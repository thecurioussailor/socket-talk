import FriendTab from "@/components/FriendTab";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import UserProfileCard from "@/components/UserProfileCard";
import FriendRequestTab from "@/components/FriendRequestTab";
import FriendSearchTab from "@/components/FriendSearchTab";
  
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
interface FriendType {
    id: string,
    username: string,
    profile: {
        name: string,
        avatar: string
    }
}
export const fetchFriends = async (): Promise<FriendType[]> => {
    const response = await axios.get(`${BACKEND_URL}/friends`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    console.log("friends",response.data)
    return response.data
}

export const fetchFriendByUsername = async (username: string) => {
    const response = await axios.get(`${BACKEND_URL}/users/search/${username}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    console.log(response.data);
    return response.data;
}

interface RequestType {
    id: string,
    status: string,
    sender: {
        id: string,
        username: string
    },
    receiver: {
        id: string,
        username: string
    }
    createdAt: string
}
interface FriendRequestType {
    sent: RequestType[];
    received: RequestType[];
}
const fetchFriendRequests = async (): Promise<FriendRequestType> => {
    const response = await axios.get(`${BACKEND_URL}/friends/requests`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    console.log(response.data)
    return response.data;
}
const Friends = () => {
    const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const {data, isError, isLoading} = useQuery({
        queryKey: ["friends"],
        queryFn: fetchFriends
    })

    const {data: friendRequestsData, isError: friendRequestError, isLoading: friendRequestLoading} = useQuery({
        queryKey: ["friendRequests"],
        queryFn: fetchFriendRequests
    })

    const {data: friendByUsernameData, refetch: refetchFriendByUsername} = useQuery({
        queryKey: ["friendByUsername", search],
        queryFn: () => fetchFriendByUsername(search),
        enabled: false
    })

    const handleSearch = async () => {
        await refetchFriendByUsername();
        setIsDropdownOpen(true);
    }
    const handleProfile = (id: string) => {
        setSelectedFriendId(id)
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(dropdownRef.current && !dropdownRef.current.contains(e.target as Node)){
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.addEventListener("mousedown", handleClickOutside);
        }
    }, [])
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
        <div className="flex relative items-center gap-2 border rounded-lg p-1 justify-between">
            <Input 
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 border-none focus-visible:ring-0"
            />
            <Button 
                onClick={handleSearch}
                className="bg-transparent"
            >
                <SearchIcon/>
            </Button>
            {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-12 left-0 z-50 w-full border border-zinc-700 rounded-lg bg-[#191919] p-1"
            >
              {isLoading ? (
                <p className="text-gray-500">Loading...</p>
              ) : friendByUsernameData ? (
                <div className="flex flex-col gap-2">
                  {friendByUsernameData && 
                        <FriendSearchTab id={friendByUsernameData.id} username={friendByUsernameData.username} name={friendByUsernameData.profile.name} avatar={friendByUsernameData.profile.avatar}/>
                  }
                </div>
              ) : (
                <p className="p-2 text-gray-500 text-sm">No friends found.</p>
              )}
            </div>
          )}
            
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
                {data?.length === 0 && <h1>no friends</h1>}
                {data?.map(friend => (
                    <FriendTab  key={friend.id} id={friend.id} name={friend.profile?.name} username={friend.username} avatar={friend.profile?.avatar} onClick={() => handleProfile(friend.id)}/>
                ))}
            </div>
            </TabsContent>
            <TabsContent value="pendingrequest" className="w-full py-2">
                {friendRequestsData?.received?.length === 0 && <h1>no friends</h1>}
                {friendRequestsData?.received.map(received => (
                    <FriendRequestTab key={received.id} type={'received'} id={received.id} username={received.sender.username} status={received.status} onClick={() => handleProfile(received.sender.id)}/>
                ))}
            </TabsContent>
            <TabsContent value="sentrequest" className="w-full py-2 flex flex-col gap-1">
                {friendRequestsData?.sent?.length === 0 && <h1>no friends</h1>}
                {friendRequestsData?.sent.map(sent => (
                    <FriendRequestTab key={sent.id} type={'sent'} id={sent.id} username={sent.receiver.username} status={sent.status} onClick={() => handleProfile(sent.sender.id)}/>
                ))}
            </TabsContent>
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