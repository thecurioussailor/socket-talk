import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { IoMdPersonAdd } from "react-icons/io";
import { MdFileDownloadDone } from "react-icons/md";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { fetchFriends } from "@/pages/Friends";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const sendFriendRequest = async (id: string) => {
    const response = await axios.post(`${BACKEND_URL}/friends/requests/send/${id}`, {},{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    console.log(response.data);
    return response.data;
}

const FriendSearchTab = ({ username,name, id, avatar}: {username: string, name: string, id: string, avatar: string}) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const {data} = useQuery({
            queryKey: ["friends"],
            queryFn: fetchFriends
        })
    
    const { mutate } = useMutation({
        mutationFn: sendFriendRequest,
        onSuccess: () => {
            toast({
                title: "Friend request sent",
                description: "Your friend request was successfully sent"
            })
        },
        onError: (error) => {
            console.error(error);
            toast({
              title: "Error",
              description: "Failed to send friend request. Please try again."
            });
          }
    })

    const handleSendRequest = () => {
        mutate(id);
        queryClient.invalidateQueries({
            queryKey: ["friendRequests"]
        })
    }
  return (
    <div className="flex p-2 justify-between items-center h-10 bg-[#191919] border-zinc-700">   
        <Button
            className="p-0"
        >
            <div className="flex items-center gap-4 p-4">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-left text-xs">{username}</p>
                    <p className="text-left text-xs">{name}</p>
                </div>
            </div>
        </Button>
        <div className="flex items-center pr-2">
            {data?.some(friend => friend.username === username) ? (
                <Button><MdFileDownloadDone /></Button>
            ): (
                <Button onClick={handleSendRequest}><IoMdPersonAdd /></Button>
            )}
        </div>
    </div>
  )
}

export default FriendSearchTab