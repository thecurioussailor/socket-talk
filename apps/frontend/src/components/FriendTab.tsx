import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const removeFriend =  (id: string) => {
    return axios.delete(`${BACKEND_URL}/friends/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

const FriendTab = ({ username, id, onClick}: {username: string, id: string, onClick: () => void}) => {
    const { toast } = useToast()
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
    mutationFn: () => removeFriend(id),
    onSuccess: () => {
        toast({
            title: "Friend Removed",
            description: "You are no longer friend with " + username
        })
        queryClient.invalidateQueries({ queryKey: ["friends"]});
    },
    onError: (error) => {
        toast({
            title: "Friend Not Removed",
            description: "Error while removing try after sometimes",
          })
    }
   })
  return (
    <div className="flex p-2 justify-between items-center h-16 bg-[#191919] rounded-lg border border-zinc-700">   
        <Button 
            onClick={onClick}
            className="p-0"
        >
            <div className="flex items-center gap-4 p-4">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-left text-lg">{username}</p>
                </div>
            </div>
        </Button>
        <div className="flex items-center pr-2">
            <DropdownMenu>
                <DropdownMenuTrigger className="border-none"><HiOutlineDotsVertical/></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="cursor-pointer" onClick={onClick}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => mutate()}>Remove</DropdownMenuItem>
                    <DropdownMenuItem>Block</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
  )
}

export default FriendTab