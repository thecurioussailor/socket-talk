import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { FaCheck } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const removeRequest =  (requestId: string) => {
    return axios.delete(`${BACKEND_URL}/friends/${requestId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

const respondToFriendRequest = async (requestId: string) => {
    const response = await axios.put(`${BACKEND_URL}/friends/requests/${requestId}`, {
        status: 'ACCEPTED'
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })

    return response.data;
}

const FriendRequestTab = ({ username, name, avatar, type, id, status, onClick}: {username: string, name: string, avatar: string, type: string, id: string,status: string, onClick: () => void}) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: respondToFriendRequest,
        onSuccess: () => {
            toast({
                title: "You accepted the friend request",
                description: "You both are friends now"
            })
            queryClient.invalidateQueries({
                queryKey: ["friendRequests"]
            })
        },
        onError: (error) => {
            toast({
                title: "Error while accepting the request",
                description: "Please try after sometimes" + error
            })
        }
    })
    
    const handleAcceptRequest = () => {
        mutate(id);
        toast({
            title: "Request Accepted Successfully",
            description: "You have accepted the friend request"
        })
    }
  return (
    <div className="flex p-2 justify-between items-center h-16 bg-[#191919] rounded-lg border border-zinc-700">   
        <Button 
            onClick={onClick}
            className="p-0"
        >
            <div className="flex items-center gap-4 p-4">
                <Avatar>
                    <AvatarImage src={avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-left text-lg">{username}</p>
                    <p className="text-left text-lg">{name}</p>
                </div>
            </div>
        </Button>
        <div className="flex items-center pr-2">
            <div><Badge>{status}</Badge></div>
            {(status === 'PENDING' && type === 'received') && (<div>
                <Button onClick={handleAcceptRequest}><FaCheck/></Button>
            </div>)
            }
        </div>
    </div>
  )
}

export default FriendRequestTab